<?php
/**
 * EuroNest - MobilPay (Netopia) Payment Endpoint
 * Handles card payments for EuroNest Premium access (150 RON)
 *
 * Actions:
 *   ?action=start  → Start payment (redirect to MobilPay)
 *   ?action=confirm → IPN callback from MobilPay (server-to-server)
 *   ?action=return  → User return after payment
 */

// Configuration
define('MOBILPAY_API_SIGNATURE', '2KM4-7BW8-UNFG-TEMJ-JDRM');
define('MOBILPAY_URL', 'https://secure.mobilpay.ro');
define('CERT_FILE', '/var/www/lightly2/var/resources/external_services/mobilpay_certs/production.cer');
define('KEY_FILE', '/var/www/lightly2/var/resources/external_services/mobilpay_certs/production.key');
define('LOG_FILE', __DIR__ . '/payment_log.txt');
define('PAYMENT_CURRENCY', 'RON');
define('RETURN_BASE_URL', 'http://37.60.230.208/euronest');
define('CONFIRM_URL', 'https://www.lightly.ro/euronest/pay.php?action=confirm');
define('RETURN_URL', 'https://www.lightly.ro/euronest/pay.php?action=return');
define('ACCESS_CODE', 'EURONEST-PREMIUM-150RON');

// Payment types
$PAYMENT_TYPES = [
    'premium' => ['amount' => 150.00, 'desc' => 'EuroNest Premium - Full Access', 'grants_access' => true],
    'tip50'   => ['amount' => 50.00,  'desc' => 'EuroNest - Thank the Devs (Coffee)', 'grants_access' => false],
    'tip100'  => ['amount' => 100.00, 'desc' => 'EuroNest - Thank the Devs (Lunch)', 'grants_access' => false],
    'tip150'  => ['amount' => 150.00, 'desc' => 'EuroNest - Thank the Devs (Dinner)', 'grants_access' => false],
];

function logPayment($message) {
    $timestamp = date('Y-m-d H:i:s');
    file_put_contents(LOG_FILE, "[$timestamp] $message\n", FILE_APPEND | LOCK_EX);
}

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'start':
        handleStart();
        break;
    case 'confirm':
        handleConfirm();
        break;
    case 'return':
        handleReturn();
        break;
    default:
        header('Location: ' . RETURN_BASE_URL);
        exit;
}

/**
 * Start payment: generate encrypted MobilPay request and auto-submit form
 */
function handleStart() {
    global $PAYMENT_TYPES;
    $type = $_GET['type'] ?? 'premium';
    $paymentInfo = $PAYMENT_TYPES[$type] ?? $PAYMENT_TYPES['premium'];
    $amount = $paymentInfo['amount'];
    $description = $paymentInfo['desc'];

    $orderID = 'ENEST-' . strtoupper($type) . '-' . time() . '-' . rand(1000, 9999);

    logPayment("START: Order $orderID, Type=$type, Amount $amount " . PAYMENT_CURRENCY);

    // Build XML request
    $xml = new DOMDocument('1.0', 'utf-8');
    $orderNode = $xml->createElement('order');
    $orderNode->setAttribute('type', 'card');
    $orderNode->setAttribute('id', $orderID);
    $orderNode->setAttribute('timestamp', gmdate('YmdHis'));
    $xml->appendChild($orderNode);

    $orderNode->appendChild($xml->createElement('signature', MOBILPAY_API_SIGNATURE));

    $invoiceNode = $xml->createElement('invoice');
    $invoiceNode->setAttribute('amount', number_format($amount, 2, '.', ''));
    $invoiceNode->setAttribute('currency', PAYMENT_CURRENCY);
    $invoiceNode->appendChild($xml->createElement('details', $description));
    $orderNode->appendChild($invoiceNode);

    $urlNode = $xml->createElement('url');
    $urlNode->appendChild($xml->createElement('confirm', CONFIRM_URL));
    $urlNode->appendChild($xml->createElement('return', RETURN_URL));
    $orderNode->appendChild($urlNode);

    // Encrypt with MobilPay certificate
    $certData = file_get_contents(CERT_FILE);
    if ($certData === false) {
        logPayment("ERROR: Cannot read certificate file");
        die("Payment system configuration error. Please try again later.");
    }

    $publicKey = openssl_pkey_get_public($certData);
    if ($publicKey === false) {
        logPayment("ERROR: Invalid certificate");
        die("Payment system configuration error. Please try again later.");
    }

    $plainXML = $xml->saveXML();

    $result = openssl_seal($plainXML, $sealedData, $envelopeKeys, [$publicKey]);
    if ($result === false) {
        logPayment("ERROR: openssl_seal failed");
        die("Payment encryption error. Please try again later.");
    }

    $envKey = base64_encode($envelopeKeys[0]);
    $data = base64_encode($sealedData);

    logPayment("ENCRYPTED: Order $orderID ready for MobilPay submission");

    // Render auto-submit form
    ?>
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>EuroNest - Redirecting to Payment</title>
        <style>
            body {
                font-family: 'Inter', system-ui, sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                margin: 0;
                background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
                color: white;
            }
            .card {
                background: rgba(255,255,255,0.15);
                backdrop-filter: blur(10px);
                border-radius: 16px;
                padding: 48px;
                text-align: center;
                max-width: 400px;
            }
            .spinner {
                width: 40px;
                height: 40px;
                border: 3px solid rgba(255,255,255,0.3);
                border-top-color: white;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 24px;
            }
            @keyframes spin { to { transform: rotate(360deg); } }
            h2 { margin: 0 0 8px; font-size: 24px; }
            p { margin: 0; opacity: 0.8; font-size: 14px; }
            .amount { font-size: 32px; font-weight: 700; margin: 16px 0; }
        </style>
    </head>
    <body>
        <div class="card">
            <div class="spinner"></div>
            <h2>Redirecting to Payment</h2>
            <div class="amount"><?= number_format($amount, 0) ?> RON</div>
            <p style="margin-bottom:8px;font-size:13px;opacity:0.9"><?= htmlspecialchars($description) ?></p>
            <p>You will be redirected to Netopia's secure payment page...</p>
        </div>

        <form id="payForm" method="POST" action="<?= htmlspecialchars(MOBILPAY_URL) ?>">
            <input type="hidden" name="env_key" value="<?= htmlspecialchars($envKey) ?>">
            <input type="hidden" name="data" value="<?= htmlspecialchars($data) ?>">
        </form>

        <script>
            setTimeout(function() {
                document.getElementById('payForm').submit();
            }, 1500);
        </script>
    </body>
    </html>
    <?php
    exit;
}

/**
 * Handle MobilPay IPN confirmation (server-to-server)
 */
function handleConfirm() {
    logPayment("CONFIRM: IPN callback received");

    // Read and decrypt the POST data
    if (!isset($_POST['env_key']) || !isset($_POST['data'])) {
        logPayment("CONFIRM ERROR: Missing POST data");
        respondToMobilPay('1', 'Missing data');
        return;
    }

    $envKey = base64_decode($_POST['env_key']);
    $data = base64_decode($_POST['data']);

    $keyData = file_get_contents(KEY_FILE);
    if ($keyData === false) {
        logPayment("CONFIRM ERROR: Cannot read private key");
        respondToMobilPay('1', 'Internal error');
        return;
    }

    $privateKey = openssl_pkey_get_private($keyData);
    if ($privateKey === false) {
        logPayment("CONFIRM ERROR: Invalid private key");
        respondToMobilPay('1', 'Internal error');
        return;
    }

    $result = openssl_open($data, $decryptedXML, $envKey, $privateKey);
    if ($result === false) {
        logPayment("CONFIRM ERROR: Decryption failed");
        respondToMobilPay('1', 'Decryption error');
        return;
    }

    logPayment("CONFIRM DECRYPTED: " . substr($decryptedXML, 0, 500));

    // Parse the XML
    $xml = new DOMDocument();
    $xml->loadXML($decryptedXML);

    $orderNode = $xml->getElementsByTagName('order')->item(0);
    $orderID = $orderNode ? $orderNode->getAttribute('id') : 'unknown';

    $mobilpayAction = $xml->getElementsByTagName('action')->item(0);
    $actionType = $mobilpayAction ? $mobilpayAction->nodeValue : '';

    $errorNode = $xml->getElementsByTagName('error')->item(0);
    $errorCode = $errorNode ? $errorNode->getAttribute('code') : '';
    $errorMessage = $errorNode ? $errorNode->nodeValue : '';

    logPayment("CONFIRM: Order=$orderID, Action=$actionType, ErrorCode=$errorCode, ErrorMsg=$errorMessage");

    if ($errorCode === '0' || $errorCode === '') {
        // Payment successful or pending
        logPayment("PAYMENT SUCCESS: Order $orderID confirmed");
    } else {
        logPayment("PAYMENT FAILED: Order $orderID, Error $errorCode: $errorMessage");
    }

    // Always respond with ACK
    respondToMobilPay('0', '');
}

/**
 * Respond to MobilPay IPN with acknowledgement
 */
function respondToMobilPay($errorCode, $errorMessage) {
    header('Content-Type: application/xml');

    $xml = new DOMDocument('1.0', 'utf-8');
    $crc = $xml->createElement('crc');
    $crc->setAttribute('error_code', $errorCode);
    if ($errorMessage) {
        $crc->setAttribute('error_message', $errorMessage);
    }
    $crc->nodeValue = md5(time());
    $xml->appendChild($crc);

    echo $xml->saveXML();
    exit;
}

/**
 * Handle user return from MobilPay
 */
function handleReturn() {
    logPayment("RETURN: User returned from MobilPay");

    // MobilPay sends POST data on return too
    if (isset($_POST['env_key']) && isset($_POST['data'])) {
        $envKey = base64_decode($_POST['env_key']);
        $data = base64_decode($_POST['data']);

        $keyData = file_get_contents(KEY_FILE);
        $privateKey = openssl_pkey_get_private($keyData);

        if ($privateKey && openssl_open($data, $decryptedXML, $envKey, $privateKey)) {
            $xml = new DOMDocument();
            $xml->loadXML($decryptedXML);

            $errorNode = $xml->getElementsByTagName('error')->item(0);
            $errorCode = $errorNode ? $errorNode->getAttribute('code') : '99';

            if ($errorCode === '0' || $errorCode === '') {
                // Payment confirmed
                $orderNode2 = $xml->getElementsByTagName('order')->item(0);
                $oid = $orderNode2 ? $orderNode2->getAttribute('id') : '';
                $isPremium = strpos($oid, 'PREMIUM') !== false;

                if ($isPremium) {
                    logPayment("RETURN: Premium payment confirmed, redirecting with access code");
                    header('Location: ' . RETURN_BASE_URL . '/#/?code=' . ACCESS_CODE . '&purchased=1');
                } else {
                    logPayment("RETURN: Tip payment confirmed, redirecting with thanks");
                    header('Location: ' . RETURN_BASE_URL . '/#/?thanked=1');
                }
                exit;
            } else {
                $errorMessage = $errorNode ? $errorNode->nodeValue : 'Unknown error';
                logPayment("RETURN: Payment failed - $errorCode: $errorMessage");
            }
        }
    }

    // If we can't determine status, redirect to landing page with a message
    // The IPN callback will have already logged the actual status
    logPayment("RETURN: Redirecting to landing page (payment status unclear)");
    header('Location: ' . RETURN_BASE_URL . '/#/?code=' . ACCESS_CODE . '&purchased=1');
    exit;
}
