"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  SearchIcon,
  UsersIcon,
  CircleCheckIcon,
  UserXIcon,
  ShieldIcon,
  FlaskConicalIcon,
  MapPinIcon,
  BriefcaseIcon,
  Columns3Icon,
  ChevronDownIcon,
  ChevronsLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsRightIcon,
  FilterIcon,
  EyeIcon,
  PencilIcon,
  Trash2Icon,
  MessageSquareIcon,
  UserCheckIcon,
  CalendarDaysIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { AddUserSheet } from "@/components/dashboard/add-user-sheet";
import { DeleteUserDialog } from "@/components/dashboard/delete-user-dialog";
import { AssignValidatorsDialog } from "@/components/dashboard/assign-validators-dialog";
import { EditUserSheet } from "@/components/dashboard/edit-user-sheet";
import { SendMessageDialog } from "@/components/dashboard/send-message-dialog";
import { UserLeaveSummaryDialog } from "@/components/dashboard/user-leave-summary-dialog";
import {
  RoleBadge,
  ROLE_STYLES,
  SectionBadge,
  StatusBadge,
} from "@/components/dashboard/user-badges";
import { UserViewDialog } from "@/components/dashboard/user-view-dialog";
import { SENEGAL_REGIONS } from "@/lib/constants/senegal-regions";
import type { DashboardUser } from "@/lib/types/dashboard-user";
import {
  USER_ROLE_LABELS,
  USER_ROLES,
  type UserRole,
} from "@/lib/permissions/roles";
import { canManageLeaveSettings } from "@/lib/permissions/can";

export type { DashboardUser };

type ViewTab =
  | "all"
  | "active"
  | "inactive"
  | "management"
  | "research";

const MANAGEMENT_ROLES: UserRole[] = [
  "super_admin",
  "admin",
  "directeur",
  "rh",
  "manager",
];

const RESEARCH_ROLES: UserRole[] = [
  "chercheur",
  "employe",
  "chauffeur",
  "pdcvr",
  "aat",
  "directeur_technique",
  "redacteur",
];

const VIEW_TABS: {
  value: ViewTab;
  label: string;
  icon: React.ReactNode;
  activeClass: string;
  badgeClass: string;
}[] = [
  {
    value: "all",
    label: "Tous",
    icon: <UsersIcon className="size-4" />,
    activeClass: "data-active:bg-slate-100 data-active:text-slate-900",
    badgeClass: "bg-slate-500/15 text-slate-700",
  },
  {
    value: "active",
    label: "Actifs",
    icon: <CircleCheckIcon className="size-4 text-emerald-600" />,
    activeClass: "data-active:bg-emerald-50 data-active:text-emerald-800",
    badgeClass: "bg-emerald-500/15 text-emerald-700",
  },
  {
    value: "inactive",
    label: "Inactifs",
    icon: <UserXIcon className="size-4 text-rose-600" />,
    activeClass: "data-active:bg-rose-50 data-active:text-rose-800",
    badgeClass: "bg-rose-500/15 text-rose-700",
  },
  {
    value: "management",
    label: "Encadrement",
    icon: <ShieldIcon className="size-4 text-violet-600" />,
    activeClass: "data-active:bg-violet-50 data-active:text-violet-800",
    badgeClass: "bg-violet-500/15 text-violet-700",
  },
  {
    value: "research",
    label: "Chercheurs",
    icon: <FlaskConicalIcon className="size-4 text-sky-600" />,
    activeClass: "data-active:bg-sky-50 data-active:text-sky-800",
    badgeClass: "bg-sky-500/15 text-sky-700",
  },
];

function UserRowActions({
  user,
  onView,
  onEdit,
  onValidators,
  onDelete,
  onMessage,
  onLeaveSummary,
  showLeaveSummary,
}: {
  user: DashboardUser;
  onView: (user: DashboardUser) => void;
  onEdit: (user: DashboardUser) => void;
  onValidators: (user: DashboardUser) => void;
  onDelete: (user: DashboardUser) => void;
  onMessage: (user: DashboardUser) => void;
  onLeaveSummary: (user: DashboardUser) => void;
  showLeaveSummary: boolean;
}) {
  const fullName = `${user.firstname} ${user.lastname}`;

  const handleView = () => {
    onView(user);
  };

  const handleEdit = () => {
    onEdit(user);
  };

  const handleValidators = () => {
    onValidators(user);
  };

  const handleDelete = () => {
    onDelete(user);
  };

  const handleMessage = () => {
    onMessage(user);
  };

  const handleLeaveSummary = () => {
    onLeaveSummary(user);
  };

  const actions = [
    {
      label: "Voir le profil",
      icon: EyeIcon,
      onClick: handleView,
      className:
        "text-sky-600 hover:bg-sky-50 hover:text-sky-700 dark:hover:bg-sky-950/40",
    },
    {
      label: "Modifier",
      icon: PencilIcon,
      onClick: handleEdit,
      className:
        "text-amber-600 hover:bg-amber-50 hover:text-amber-700 dark:hover:bg-amber-950/40",
    },
    {
      label: "Validateurs",
      icon: UserCheckIcon,
      onClick: handleValidators,
      className:
        "text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 dark:hover:bg-indigo-950/40",
    },
    ...(showLeaveSummary
      ? [
          {
            label: "Congés & absences",
            icon: CalendarDaysIcon,
            onClick: handleLeaveSummary,
            className:
              "text-teal-600 hover:bg-teal-50 hover:text-teal-700 dark:hover:bg-teal-950/40",
          },
        ]
      : []),
    {
      label: "Envoyer un message",
      icon: MessageSquareIcon,
      onClick: handleMessage,
      className:
        "text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/40",
    },
    {
      label: "Supprimer",
      icon: Trash2Icon,
      onClick: handleDelete,
      className:
        "text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/40",
    },
  ];

  return (
    <div className="flex items-center justify-end gap-0.5">
      {actions.map(({ label, icon: Icon, onClick, className }) => (
        <Tooltip key={label}>
          <TooltipTrigger
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className={cn("size-8 rounded-lg", className)}
                onClick={onClick}
              />
            }
          >
            <Icon className="size-4" />
            <span className="sr-only">{label}</span>
          </TooltipTrigger>
          <TooltipContent side="top">{label}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}

function filterByViewTab(users: DashboardUser[], tab: ViewTab): DashboardUser[] {
  switch (tab) {
    case "active":
      return users.filter((u) => u.isActive);
    case "inactive":
      return users.filter((u) => !u.isActive);
    case "management":
      return users.filter((u) => MANAGEMENT_ROLES.includes(u.role));
    case "research":
      return users.filter((u) => RESEARCH_ROLES.includes(u.role));
    default:
      return users;
  }
}

function countByViewTab(users: DashboardUser[], tab: ViewTab): number {
  return filterByViewTab(users, tab).length;
}

export function UsersTable({ data }: { data: DashboardUser[] }) {
  const router = useRouter();
  const { data: session } = useSession();
  const canViewLeaveSummary = session?.user?.role
    ? canManageLeaveSettings(session.user.role as UserRole)
    : false;
  const [viewTab, setViewTab] = useState<ViewTab>("all");
  const [sectionFilter, setSectionFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [viewUserId, setViewUserId] = useState<string | null>(null);
  const [viewPreview, setViewPreview] = useState<DashboardUser | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DashboardUser | null>(null);
  const [messageTarget, setMessageTarget] = useState<DashboardUser | null>(null);
  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [validatorsTarget, setValidatorsTarget] =
    useState<DashboardUser | null>(null);
  const [leaveSummaryTarget, setLeaveSummaryTarget] =
    useState<DashboardUser | null>(null);

  const handleViewUser = useCallback((user: DashboardUser) => {
    setViewPreview(user);
    setViewUserId(user._id);
  }, []);

  const handleDeleteUser = useCallback((user: DashboardUser) => {
    setDeleteTarget(user);
  }, []);

  const handleMessageUser = useCallback((user: DashboardUser) => {
    setMessageTarget(user);
  }, []);

  const handleEditUser = useCallback((user: DashboardUser) => {
    setEditUserId(user._id);
  }, []);

  const handleValidatorsUser = useCallback((user: DashboardUser) => {
    setValidatorsTarget(user);
  }, []);

  const handleLeaveSummaryUser = useCallback((user: DashboardUser) => {
    setLeaveSummaryTarget(user);
  }, []);

  const filteredByControls = useMemo(() => {
    let result = filterByViewTab(data, viewTab);

    if (sectionFilter !== "all") {
      result = result.filter((u) => u.section === sectionFilter);
    }

    if (roleFilter !== "all") {
      result = result.filter((u) => u.role === roleFilter);
    }

    return result;
  }, [data, viewTab, sectionFilter, roleFilter]);

  const sectionOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const user of filterByViewTab(data, viewTab)) {
      counts.set(user.section, (counts.get(user.section) ?? 0) + 1);
    }
    return SENEGAL_REGIONS.filter((r) => counts.has(r)).map((region) => ({
      value: region,
      label: region,
      count: counts.get(region) ?? 0,
    }));
  }, [data, viewTab]);

  const roleOptions = useMemo(() => {
    const counts = new Map<UserRole, number>();
    for (const user of filterByViewTab(data, viewTab)) {
      counts.set(user.role, (counts.get(user.role) ?? 0) + 1);
    }
    return USER_ROLES.filter((r) => counts.has(r)).map((role) => ({
      value: role,
      label: USER_ROLE_LABELS[role],
      count: counts.get(role) ?? 0,
    }));
  }, [data, viewTab]);

  const columns = useMemo<ColumnDef<DashboardUser>[]>(
    () => [
      {
        accessorKey: "lastname",
        header: "Nom complet",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--inp-vert)]/10 text-xs font-semibold text-[var(--inp-vert)]">
              {row.original.firstname[0]}
              {row.original.lastname[0]}
            </div>
            <div>
              <p className="font-medium">
                {row.original.firstname} {row.original.lastname}
              </p>
              <p className="text-xs text-muted-foreground">
                {row.original.email}
              </p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "phone",
        header: "Téléphone",
        cell: ({ row }) => row.original.phone || "—",
      },
      {
        accessorKey: "section",
        header: "Section",
        cell: ({ row }) => <SectionBadge section={row.original.section} />,
      },
      {
        accessorKey: "occupation",
        header: "Fonction",
        cell: ({ row }) => (
          <div>
            <p className="font-medium">{row.original.occupation}</p>
            {row.original.service && (
              <p className="text-xs text-muted-foreground">
                {row.original.service}
              </p>
            )}
          </div>
        ),
      },
      {
        accessorKey: "role",
        header: "Rôle",
        cell: ({ row }) => <RoleBadge role={row.original.role} />,
      },
      {
        accessorKey: "isActive",
        header: "Statut",
        cell: ({ row }) => <StatusBadge isActive={row.original.isActive} />,
      },
      {
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => (
          <UserRowActions
            user={row.original}
            onView={handleViewUser}
            onEdit={handleEditUser}
            onValidators={handleValidatorsUser}
            onDelete={handleDeleteUser}
            onMessage={handleMessageUser}
            onLeaveSummary={handleLeaveSummaryUser}
            showLeaveSummary={canViewLeaveSummary}
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
    ],
    [
      handleViewUser,
      handleEditUser,
      handleValidatorsUser,
      handleDeleteUser,
      handleMessageUser,
      handleLeaveSummaryUser,
      canViewLeaveSummary,
    ],
  );

  const table = useReactTable({
    data: filteredByControls,
    columns,
    state: { sorting, globalFilter, columnVisibility },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 10 },
    },
  });

  const handleViewChange = (value: string) => {
    setViewTab(value as ViewTab);
    setSectionFilter("all");
    setRoleFilter("all");
    table.setPageIndex(0);
  };

  return (
    <>
      <TooltipProvider delay={200}>
      <Tabs
        value={viewTab}
        onValueChange={handleViewChange}
        className="w-full flex-col justify-start gap-6"
      >
      {/* Barre de filtres principale — style data-table */}
      <div className="flex flex-col gap-4 px-4 lg:px-6">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          {/* Onglets desktop */}
          <TabsList className="hidden h-auto flex-wrap **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 lg:flex">
            {VIEW_TABS.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className={cn("gap-1.5 px-3 py-1.5", tab.activeClass)}
              >
                {tab.icon}
                {tab.label}
                <Badge
                  data-slot="badge"
                  variant="secondary"
                  className={cn("ml-0.5 min-w-5", tab.badgeClass)}
                >
                  {countByViewTab(data, tab.value)}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Select mobile */}
          <Select
            value={viewTab}
            onValueChange={(value) => handleViewChange(value ?? "all")}
            items={VIEW_TABS.map((t) => ({
              label: `${t.label} (${countByViewTab(data, t.value)})`,
              value: t.value,
            }))}
          >
            <SelectTrigger className="flex w-full lg:hidden" size="sm">
              <FilterIcon className="size-4 text-muted-foreground" />
              <SelectValue placeholder="Filtrer la vue" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {VIEW_TABS.map((tab) => (
                  <SelectItem key={tab.value} value={tab.value}>
                    <span className="flex items-center gap-2">
                      {tab.icon}
                      {tab.label} ({countByViewTab(data, tab.value)})
                    </span>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Filtres secondaires */}
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={sectionFilter}
              onValueChange={(v) => {
                setSectionFilter(v ?? "all");
                table.setPageIndex(0);
              }}
              items={[
                { label: "Toutes les sections", value: "all" },
                ...sectionOptions.map((s) => ({
                  label: `${s.label} (${s.count})`,
                  value: s.value,
                })),
              ]}
            >
              <SelectTrigger size="sm" className="w-[180px] border-orange-200 bg-orange-50/50">
                <MapPinIcon className="size-4 text-orange-600" />
                <SelectValue placeholder="Section" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">Toutes les sections</SelectItem>
                  {sectionOptions.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label} ({s.count})
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select
              value={roleFilter}
              onValueChange={(v) => {
                setRoleFilter(v ?? "all");
                table.setPageIndex(0);
              }}
              items={[
                { label: "Tous les rôles", value: "all" },
                ...roleOptions.map((r) => ({
                  label: `${r.label} (${r.count})`,
                  value: r.value,
                })),
              ]}
            >
              <SelectTrigger size="sm" className="w-[180px] border-violet-200 bg-violet-50/50">
                <BriefcaseIcon className="size-4 text-violet-600" />
                <SelectValue placeholder="Rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">Tous les rôles</SelectItem>
                  {roleOptions.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      <span className="flex items-center gap-2">
                        <span
                          className={cn(
                            "size-2 rounded-full",
                            ROLE_STYLES[r.value].dot,
                          )}
                        />
                        {r.label} ({r.count})
                      </span>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button variant="outline" size="sm" />}
              >
                <Columns3Icon />
                Colonnes
                <ChevronDownIcon />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id === "lastname"
                        ? "Nom complet"
                        : column.id === "isActive"
                          ? "Statut"
                          : column.id === "occupation"
                            ? "Fonction"
                            : column.id === "actions"
                              ? "Actions"
                              : column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Recherche + bouton ajout */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-md">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom, e-mail, fonction…"
              value={globalFilter}
              onChange={(e) => {
                setGlobalFilter(e.target.value);
                table.setPageIndex(0);
              }}
              className="border-slate-200 bg-slate-50/50 pl-9 focus-visible:border-[var(--inp-vert)] focus-visible:ring-[var(--inp-vert)]/20"
            />
          </div>
          <AddUserSheet />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="overflow-hidden rounded-lg border mx-4 lg:mx-6">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-muted/40">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="hover:bg-muted/30">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Aucun utilisateur ne correspond aux filtres sélectionnés.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination — style data-table */}
        <div className="flex items-center justify-between px-4 lg:px-6">
          <p className="hidden text-sm text-muted-foreground lg:block">
            {table.getFilteredRowModel().rows.length} utilisateur
            {table.getFilteredRowModel().rows.length > 1 ? "s" : ""} affiché
            {table.getFilteredRowModel().rows.length > 1 ? "s" : ""}
          </p>
          <div className="flex w-full items-center gap-6 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Lignes par page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => table.setPageSize(Number(value))}
                items={[5, 10, 20, 50].map((n) => ({
                  label: `${n}`,
                  value: `${n}`,
                }))}
              >
                <SelectTrigger size="sm" className="w-16" id="rows-per-page">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {[5, 10, 20, 50].map((n) => (
                      <SelectItem key={n} value={`${n}`}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <p className="text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} sur{" "}
              {Math.max(table.getPageCount(), 1)}
            </p>
            <div className="ml-auto flex items-center gap-1 lg:ml-0">
              <Button
                variant="outline"
                size="icon"
                className="hidden size-8 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronsLeftIcon className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeftIcon className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <ChevronRightIcon className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="hidden size-8 lg:flex"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <ChevronsRightIcon className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Tabs>
      </TooltipProvider>

      <UserViewDialog
        userId={viewUserId}
        preview={viewPreview}
        open={viewUserId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setViewUserId(null);
            setViewPreview(null);
          }
        }}
      />

      <DeleteUserDialog
        user={deleteTarget}
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        onDeleted={() => {
          if (deleteTarget?._id === viewUserId) {
            setViewUserId(null);
            setViewPreview(null);
          }
          router.refresh();
        }}
      />

      <SendMessageDialog
        user={messageTarget}
        open={messageTarget !== null}
        onOpenChange={(open) => {
          if (!open) setMessageTarget(null);
        }}
      />

      <UserLeaveSummaryDialog
        user={leaveSummaryTarget}
        open={leaveSummaryTarget !== null}
        onOpenChange={(open) => {
          if (!open) setLeaveSummaryTarget(null);
        }}
      />

      <EditUserSheet
        userId={editUserId}
        open={editUserId !== null}
        onOpenChange={(open) => {
          if (!open) setEditUserId(null);
        }}
      />

      <AssignValidatorsDialog
        user={validatorsTarget}
        open={validatorsTarget !== null}
        onOpenChange={(open) => {
          if (!open) setValidatorsTarget(null);
        }}
      />
    </>
  );
}
