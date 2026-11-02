"""email reports: recipient groups, send log, article translation and duplicate-count columns

Revision ID: 0002
Revises: 0001
"""
from alembic import op

from app.models import Base

revision = "0002"
down_revision = "0001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # 0001 builds tables from the current models, so on a fresh database these already exist
    op.execute("ALTER TABLE articles ADD COLUMN IF NOT EXISTS duplicate_count integer NOT NULL DEFAULT 0")
    op.execute("ALTER TABLE articles ADD COLUMN IF NOT EXISTS headline_en text")
    op.execute("ALTER TABLE articles ADD COLUMN IF NOT EXISTS summary_en text")
    Base.metadata.create_all(bind=op.get_bind())  # recipient_groups, recipients, email_sends (skips existing)


def downgrade() -> None:
    op.execute("DROP TABLE IF EXISTS email_sends, recipients, recipient_groups")
    op.execute("ALTER TABLE articles DROP COLUMN IF EXISTS summary_en, DROP COLUMN IF EXISTS headline_en, DROP COLUMN IF EXISTS duplicate_count")
