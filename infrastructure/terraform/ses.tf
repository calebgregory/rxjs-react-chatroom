resource "aws_ses_email_identity" "personal" {
  email = var.email
}

data "aws_iam_policy_document" "personal" {
  version = "2008-10-17"

  statement {
    sid       = "stmnt1600986903916"
    effect    = "Allow"
    actions   = ["SES:SendEmail", "SES:SendRawEmail"]
    resources = [aws_ses_email_identity.personal.arn]

    principals {
      identifiers = ["cognito-idp.amazonaws.com"]
      type        = "Service"
    }
  }
}

resource "aws_ses_identity_policy" "personal" {
  identity = aws_ses_email_identity.personal.arn
  name     = "personal"
  policy   = data.aws_iam_policy_document.personal.json
}