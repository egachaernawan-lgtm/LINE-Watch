from datetime import date, datetime

from sqlalchemy import Date, DateTime, ForeignKey, Integer, String, Text, UniqueConstraint, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class RecipientGroup(Base):
    """A named mailing list for the daily report (e.g. "All employees", "Comms team")."""

    __tablename__ = "recipient_groups"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), unique=True)
    description: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    members: Mapped[list["Recipient"]] = relationship(
        cascade="all, delete-orphan", lazy="selectin", order_by="Recipient.email"
    )


class Recipient(Base):
    __tablename__ = "recipients"
    __table_args__ = (UniqueConstraint("group_id", "email", name="uq_recipient_group_email"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    group_id: Mapped[int] = mapped_column(ForeignKey("recipient_groups.id", ondelete="CASCADE"))
    email: Mapped[str] = mapped_column(Text)  # stored lower-case


class EmailSend(Base):
    """One blast of the daily report: who sent it, to which groups, how many people, outcome."""

    __tablename__ = "email_sends"

    id: Mapped[int] = mapped_column(primary_key=True)
    report_date: Mapped[date] = mapped_column(Date)
    subject: Mapped[str] = mapped_column(Text)
    recipient_count: Mapped[int] = mapped_column(Integer)
    groups: Mapped[list | None] = mapped_column(JSONB)  # group names (plus "Test" or "Extra addresses")
    sent_by: Mapped[str] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(16))  # sent | failed
    error: Mapped[str | None] = mapped_column(Text)
    sent_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
