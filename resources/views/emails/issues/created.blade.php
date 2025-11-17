<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Ticket Notification</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #f5f5f5;
            color: #333;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }

        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 32px 24px;
            color: white;
        }

        .header h1 {
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 4px;
        }

        .header p {
            font-size: 14px;
            opacity: 0.9;
        }

        .content {
            padding: 32px 24px;
        }

        .greeting {
            font-size: 16px;
            margin-bottom: 24px;
            line-height: 1.6;
        }

        .intro {
            font-size: 15px;
            color: #555;
            margin-bottom: 24px;
            line-height: 1.6;
        }

        .details {
            background-color: #f9f9f9;
            border-left: 4px solid #667eea;
            padding: 20px;
            border-radius: 4px;
            margin-bottom: 24px;
        }

        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #e0e0e0;
            font-size: 14px;
        }

        .detail-row:last-child {
            border-bottom: none;
        }

        .detail-label {
            font-weight: 600;
            color: #333;
            min-width: 120px;
        }

        .detail-value {
            color: #555;
            text-align: right;
            word-break: break-word;
        }

        .priority-high {
            color: #d32f2f;
            font-weight: 600;
        }

        .priority-medium {
            color: #f57c00;
            font-weight: 600;
        }

        .priority-low {
            color: #388e3c;
            font-weight: 600;
        }

        .description-section {
            margin-bottom: 24px;
        }

        .description-section h3 {
            font-size: 13px;
            font-weight: 600;
            color: #333;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 12px;
        }

        .description-text {
            background-color: #f9f9f9;
            padding: 16px;
            border-radius: 4px;
            font-size: 14px;
            line-height: 1.6;
            color: #555;
            border: 1px solid #e0e0e0;
        }

        .cta-section {
            margin: 32px 0;
            text-align: center;
        }

        .cta-button {
            display: inline-block;
            background-color: #667eea;
            color: white;
            padding: 12px 32px;
            border-radius: 4px;
            text-decoration: none;
            font-weight: 600;
            font-size: 14px;
            transition: background-color 0.3s ease;
        }

        .cta-button:hover {
            background-color: #764ba2;
        }

        .footer {
            background-color: #f5f5f5;
            padding: 20px 24px;
            text-align: center;
            font-size: 12px;
            color: #999;
            border-top: 1px solid #e0e0e0;
        }

        .footer p {
            margin: 4px 0;
        }
    </style>
</head>

<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>New Ticket Assigned</h1>
            <p>Support Ticketing System</p>
        </div>

        <!-- Content -->
        <div class="content">
            <div class="greeting">
                Hello {{ $issue->assignee->name ?? 'Assignee' }},
            </div>

            <div class="intro">
                A new ticket has been raised and requires your attention.
            </div>

            <!-- Details Section -->
            <div class="details">
                <div class="detail-row">
                    <span class="detail-label">Ticket ID</span>
                    <span class="detail-value">{{ $issue->id }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Title</span>
                    <span class="detail-value">{{ $issue->title }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Raised By</span>
                    <span class="detail-value">{{ $issue->creator->name ?? 'N/A' }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Department</span>
                    <span class="detail-value">{{ $issue->department->name ?? 'N/A' }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Priority</span>
                    <span class="detail-value priority-{{ strtolower($issue->priority) }}">
                        {{ $issue->priority }}
                    </span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Date & Time</span>
                    <span class="detail-value">{{ $issue->created_at->format('M d, Y • H:i') }}</span>
                </div>
            </div>

            <!-- Description -->
            <div class="description-section">
                <h3>Description</h3>
                <div class="description-text">
                    {{ $issue->description }}
                </div>
            </div>

            <!-- CTA Button -->
            <div class="cta-section">
                <a href="{{ route('issues.show', $issue) }}" class="cta-button">
                    View Ticket
                </a>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>Support Ticketing System</p>
            <p>Please review and take appropriate action.</p>
        </div>
    </div>
</body>

</html>