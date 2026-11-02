"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState, ErrorState, Skeleton } from "@/components/ui/states";
import { Tag } from "@/components/ui/tag";
import { demoMode } from "@/lib/demo";
import { parseEmails } from "@/lib/emails";
import { reportsClient } from "@/lib/reports-client";
import type { RecipientGroup } from "@/types/api";

function GroupForm({ group, onDone }: { group: RecipientGroup | null; onDone: () => void }) {
  const qc = useQueryClient();
  const [name, setName] = useState(group?.name ?? "");
  const [description, setDescription] = useState(group?.description ?? "");
  const [emailsText, setEmailsText] = useState(group?.emails.join("\n") ?? "");
  const parsed = parseEmails(emailsText);

  const save = useMutation({
    mutationFn: () => reportsClient.saveGroup({ id: group?.id, name: name.trim(), description: description.trim() || null, emails: parsed.valid }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["report-groups"] });
      onDone();
    },
  });
  const disabled = !name.trim() || parsed.invalid.length > 0 || save.isPending;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save.mutate();
      }}
      className="space-y-3 p-5"
    >
      <label className="block text-sm font-bold">
        Group name
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={120}
          className="mt-1 h-10 w-full rounded-md border border-gray-300 px-3 text-sm font-normal outline-none focus:border-brand"
        />
      </label>
      <label className="block text-sm font-bold">
        Description (optional)
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 h-10 w-full rounded-md border border-gray-300 px-3 text-sm font-normal outline-none focus:border-brand"
        />
      </label>
      <label className="block text-sm font-bold">
        Email addresses
        <textarea
          value={emailsText}
          onChange={(e) => setEmailsText(e.target.value)}
          rows={7}
          placeholder="Paste addresses: one per line, or separated by commas or semicolons"
          className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm font-normal outline-none focus:border-brand"
        />
      </label>
      <div className="text-sm text-gray-700">{parsed.valid.length} valid {parsed.valid.length === 1 ? "address" : "addresses"}</div>
      {parsed.invalid.length > 0 && (
        <p role="alert" className="text-sm text-error">
          Not a valid address: {parsed.invalid.slice(0, 3).join(", ")}
          {parsed.invalid.length > 3 && ` and ${parsed.invalid.length - 3} more`}
        </p>
      )}
      {save.error && <ErrorState message={save.error.message} />}
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={disabled}>
          {save.isPending ? "Saving…" : "Save group"}
        </Button>
        <Button type="button" size="sm" variant="secondary" onClick={onDone}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

export function GroupsPanel() {
  const qc = useQueryClient();
  const groups = useQuery({ queryKey: ["report-groups"], queryFn: () => reportsClient.groups() });
  const [editing, setEditing] = useState<number | "new" | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const remove = useMutation({
    mutationFn: (id: number) => reportsClient.deleteGroup(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["report-groups"] }),
    onSettled: () => setDeleting(null),
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <p className="flex-1 text-sm text-gray-700">
          Mailing lists for the daily report. Send to everyone, or to a specific team.
          {demoMode && " In this demo, groups are saved in this browser only."}
        </p>
        <Button size="sm" icon={<Plus className="h-4 w-4" />} disabled={editing !== null} onClick={() => setEditing("new")}>
          New group
        </Button>
      </div>
      {groups.error && <ErrorState />}
      {groups.isLoading && <Skeleton className="h-40" />}
      {remove.error && <ErrorState message={remove.error.message} />}
      <Card className="divide-y divide-gray-200">
        {editing === "new" && <GroupForm group={null} onDone={() => setEditing(null)} />}
        {groups.data?.length === 0 && editing !== "new" && (
          <EmptyState title="No groups yet">Create a group such as “All employees” and paste its email addresses.</EmptyState>
        )}
        {groups.data?.map((g) =>
          editing === g.id ? (
            <GroupForm key={g.id} group={g} onDone={() => setEditing(null)} />
          ) : (
            <div key={g.id} className="flex flex-wrap items-center gap-3 px-5 py-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold">{g.name}</span>
                  <Tag tone={g.emails.length ? "positive" : "warning"}>
                    {g.emails.length} {g.emails.length === 1 ? "address" : "addresses"}
                  </Tag>
                </div>
                {g.description && <div className="text-sm text-gray-700">{g.description}</div>}
                <div className="mt-1 truncate text-xs text-gray-500">
                  {g.emails.length === 0 ? "No addresses yet" : g.emails.slice(0, 3).join(", ") + (g.emails.length > 3 ? ` +${g.emails.length - 3} more` : "")}
                </div>
              </div>
              {deleting === g.id ? (
                <div className="flex items-center gap-2 text-sm">
                  Delete this group?
                  <Button size="sm" disabled={remove.isPending} onClick={() => remove.mutate(g.id)}>
                    Yes, delete
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => setDeleting(null)}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="flex gap-1">
                  <Button size="sm" variant="tertiary" icon={<Pencil className="h-4 w-4" />} disabled={editing !== null} onClick={() => setEditing(g.id)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="tertiary" icon={<Trash2 className="h-4 w-4" />} disabled={editing !== null} onClick={() => setDeleting(g.id)}>
                    Delete
                  </Button>
                </div>
              )}
            </div>
          ),
        )}
      </Card>
    </div>
  );
}
