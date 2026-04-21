<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
</head>
<body style="margin:0;padding:0;background-color:#09090b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#09090b;">
        <tr>
            <td align="center" style="padding:40px 20px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;">
                    <!-- Logo -->
                    <tr>
                        <td align="center" style="padding-bottom:32px;">
                            <table role="presentation" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="background:#fafafa;border-radius:12px;padding:10px 16px;">
                                        <span style="font-size:18px;font-weight:700;color:#09090b;letter-spacing:-0.02em;">Cookie Manager</span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Heading -->
                    <tr>
                        <td align="center" style="padding-bottom:12px;">
                            <h1 style="margin:0;font-size:28px;font-weight:800;color:#fafafa;letter-spacing:-0.03em;">Reset Password</h1>
                        </td>
                    </tr>

                    <!-- Description -->
                    <tr>
                        <td align="center" style="padding-bottom:32px;">
                            <p style="margin:0;font-size:14px;line-height:1.6;color:#a1a1aa;">
                                Hi {{ $name }}, we received a request to reset your password. Click the button below to set a new one.
                            </p>
                        </td>
                    </tr>

                    <!-- Button -->
                    <tr>
                        <td align="center" style="padding-bottom:32px;">
                            <table role="presentation" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="background:#fafafa;border-radius:12px;">
                                        <a href="{{ $resetUrl }}" target="_blank" style="display:inline-block;padding:12px 32px;font-size:14px;font-weight:600;color:#09090b;text-decoration:none;">
                                            Reset Password
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Link fallback -->
                    <tr>
                        <td align="center" style="padding-bottom:32px;">
                            <p style="margin:0;font-size:12px;color:#52525b;">
                                If the button doesn't work, copy and paste this link:
                            </p>
                            <p style="margin:8px 0 0;font-size:12px;word-break:break-all;">
                                <a href="{{ $resetUrl }}" style="color:#a1a1aa;text-decoration:underline;">{{ $resetUrl }}</a>
                            </p>
                        </td>
                    </tr>

                    <!-- Expiry -->
                    <tr>
                        <td align="center" style="padding-bottom:24px;">
                            <p style="margin:0;font-size:12px;color:#3f3f46;">
                                This link expires in 1 hour. If you didn't request this, you can safely ignore this email.
                            </p>
                        </td>
                    </tr>

                    <!-- Divider -->
                    <tr>
                        <td style="padding:16px 0;">
                            <hr style="border:none;border-top:1px solid rgba(250,250,250,0.08);margin:0;">
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td align="center">
                            <p style="margin:0;font-size:11px;color:#27272a;">
                                Cookie Manager &mdash; Monochrome, fast, and focused.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
