<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ticket Update Notification</title>
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
            background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
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
            border-left: 4px solid #2196F3;
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

        .changes-section {
            margin-bottom: 24px;
        }

        .changes-section h3 {
            font-size: 13px;
            font-weight: 600;
            color: #333;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
        }

        .changes-section h3::before {
            content: "";
            width: 4px;
            height: 4px;
            background-color: #2196F3;
            border-radius: 50%;
            margin-right: 8px;
        }

        .change-item {
            background-color: #f9f9f9;
            padding: 16px;
            border-radius: 4px;
            margin-bottom: 12px;
            border-left: 3px solid #2196F3;
            font-size: 14px;
            line-height: 1.6;
        }

        .change-item:last-child {
            margin-bottom: 0;
        }

        .field-name {
            font-weight: 600;
            color: #333;
            display: block;
            margin-bottom: 8px;
        }

        .change-values {
            color: #666;
            font-size: 13px;
        }

        .old-value {
            background-color: #ffebee;
            padding: 2px 6px;
            border-radius: 3px;
            color: #c62828;
        }

        .new-value {
            background-color: #e8f5e9;
            padding: 2px 6px;
            border-radius: 3px;
            color: #2e7d32;
        }

        .attachment-added {
            color: #2e7d32;
            font-weight: 500;
        }

        .attachment-removed {
            color: #c62828;
            font-weight: 500;
        }

        .cta-section {
            margin: 32px 0;
            text-align: center;
        }

        .cta-button {
            display: inline-block;
            background-color: #2196F3;
            color: white;
            padding: 12px 32px;
            border-radius: 4px;
            text-decoration: none;
            font-weight: 600;
            font-size: 14px;
            transition: background-color 0.3s ease;
        }

        .cta-button:hover {
            background-color: #1976D2;
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
            <h1>Ticket Updated</h1>
            <p>Support Ticketing System</p>
        </div>

        <!-- Content -->
        <div class="content">
            <div class="greeting">
                Hello {{ $issue->assignee->name ?? 'Assignee' }},
            </div>

            <div class="intro">
                The following ticket has been updated. Please review the latest changes.
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
                    <span class="detail-label">Last Updated</span>
                    <span class="detail-value">{{ $issue->updated_at->format('M d, Y • H:i') }}</span>
                </div>
            </div>

            <!-- Changes Section -->
            <div class="changes-section">
                <h3>Recent Changes</h3>
                @forelse ($changes as $field => $values)
                <div class="change-item">
                    @if ($field === 'attachment')
                    <span class="field-name">Attachment</span>
                    @if ($values['new'])
                    <span class="attachment-added">✓ Attachment added</span>
                    @else
                    <span class="attachment-removed">✕ Attachment removed</span>
                    @endif
                    @else
                    <span class="field-name">{{ ucfirst(str_replace('_', ' ', $field)) }}</span>
                    <div class="change-values">
                        <span class="old-value">{{ $values['old'] }}</span>
                        <span style="margin: 0 8px; color: #999;">→</span>
                        <span class="new-value">{{ $values['new'] }}</span>
                    </div>
                    @endif
                </div>
                @empty
                <div class="change-item">
                    <span style="color: #999;">No changes to display</span>
                </div>
                @endforelse
            </div>

            <!-- CTA Button -->
            <div class="cta-section">
                <a href="{{ route('issues.show', $issue) }}" class="cta-button">
                    View Updated Ticket
                </a>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>Support Ticketing System</p>
            <p>Please review the changes and take any necessary action.</p>
        </div>
    </div>
</body>

</html>