"""drop the recipient-group and send-log tables: reports are downloaded, not emailed

Revision ID: 0003
Revises: 0002
"""
from alembic import op

revision = "0003"
down_revision = "0002"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("DROP TABLE IF EXISTS email_sends, recipients, recipient_groups")


def downgrade() -> None:
    pass  # the feature was removed; nothing to restore
