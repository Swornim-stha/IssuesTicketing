<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Comment Notification</title>
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
            background: linear-gradient(135deg, #10B981 0%, #059669 100%);
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
            border-left: 4px solid #10B981;
            padding: 20px;
            border-radius: 4px;
            margin-bottom: 24px;
        }

        .detail-row {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
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
            flex: 1;
            margin-left: 16px;
        }

        .comment-section {
            margin-bottom: 24px;
        }

        .comment-section h3 {
            font-size: 13px;
            font-weight: 600;
            color: #333;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
        }

        .comment-section h3::before {
            content: "";
            width: 4px;
            height: 4px;
            background-color: #10B981;
            border-radius: 50%;
            margin-right: 8px;
        }

        .comment-author {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            font-size: 13px;
        }

        .author-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: linear-gradient(135deg, #10B981 0%, #059669 100%);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            margin-right: 10px;
            font-size: 14px;
        }

        .author-info {
            flex: 1;
        }

        .author-name {
            font-weight: 600;
            color: #333;
            display: block;
        }

        .author-time {
            font-size: 12px;
            color: #999;
        }

        .comment-box {
            background-color: #f9f9f9;
            padding: 16px;
            border-radius: 4px;
            border-left: 3px solid #10B981;
            font-size: 14px;
            line-height: 1.7;
            color: #555;
            word-break: break-word;
        }

        .cta-section {
            margin: 32px 0;
            text-align: center;
        }

        .cta-button {
            display: inline-block;
            background-color: #10B981;
            color: white;
            padding: 12px 32px;
            border-radius: 4px;
            text-decoration: none;
            font-weight: 600;
            font-size: 14px;
            transition: background-color 0.3s ease;
        }

        .cta-button:hover {
            background-color: #059669;
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
            <h1>New Comment</h1>
            <p>Support Ticketing System</p>
        </div>

        <!-- Content -->
        <div class="content">
            <div class="greeting">
                Hello {{ $comment->issue->assignee->name ?? 'Assignee' }},
            </div>

            <div class="intro">
                A new comment has been added to the ticket you are involved in.
            </div>

            <!-- Details Section -->
            <div class="details">
                <div class="detail-row">
                    <span class="detail-label">Ticket ID</span>
                    <span class="detail-value">{{ $comment->issue->id }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Title</span>
                    <span class="detail-value">{{ $comment->issue->title }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Commented By</span>
                    <span class="detail-value">{{ $comment->user->name ?? 'N/A' }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Date & Time</span>
                    <span class="detail-value">{{ $comment->created_at->format('M d, Y • H:i') }}</span>
                </div>
            </div>

            <!-- Comment Section -->
            <div class="comment-section">
                <h3>Comment</h3>

                <div class="comment-author">
                    <!-- <div class="author-avatar">
                        {{ strtoupper(substr($comment->user->name ?? 'U', 0, 1)) }}
                    </div> -->
                    <div class="author-info">
                        <span class="author-name">{{ $comment->user->name ?? 'Anonymous' }}</span>
                        <span class="author-time">{{ $comment->created_at->diffForHumans() }}</span>
                    </div>
                </div>

                <div class="comment-box">
                    {{ $comment->comment }}
                </div>
            </div>

            <!-- CTA Button -->
            <div class="cta-section">
                <a href="{{ route('issues.show', $comment->issue) }}" class="cta-button">
                    View Ticket & Reply
                </a>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>Support Ticketing System</p>
            <p>Click the button above to view the ticket and respond to the comment.</p>
        </div>
    </div>
</body>

</html>