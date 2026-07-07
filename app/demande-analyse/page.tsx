"use client";

import { useState, useMemo, useCallback } from "react";
import { SENEGAL_TERRITORY } from "@/lib/senegal-territory";
import {
  ANALYSIS_TYPE_OPTIONS,
  ANALYSIS_REQUESTER_TYPES,
} from "@/lib/constants/demande-analyse";
import { PageHero } from "@/components/ui/PageHero";
import {
    FlaskConical,
    MapPin,
    Sprout,
    TestTubes,
    Package,
    User,
    Send,
    CheckCircle2,
    ArrowRight,
    FileText,
    ShieldCheck,
    Loader2,
    AlertCircle,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface FormData {
    lastName: string;
    firstName: string;
    phone: string;
    email: string;
    requesterType: string;
    region: string;
    department: string;
    commune: string;
    latitude: string;
    longitude: string;
    surface: string;
    culturePlanned: string;
    cultureCurrent: string;
    fertilisationHistory: string;
    irrigation: string;
    problem: string;
    analysisTypes: string[];
    samplesNumber: string;
    sendMode: string;
    depositDate: string;
}

const INITIAL: FormData = {
    lastName: "",
    firstName: "",
    phone: "",
    email: "",
    requesterType: "",
    region: "",
    department: "",
    commune: "",
    latitude: "",
    longitude: "",
    surface: "",
    culturePlanned: "",
    cultureCurrent: "",
    fertilisationHistory: "",
    irrigation: "",
    problem: "",
    analysisTypes: [],
    samplesNumber: "",
    sendMode: "",
    depositDate: "",
};

const REQUESTER_TYPES = ANALYSIS_REQUESTER_TYPES;

/* Regions are now loaded from SENEGAL_TERRITORY */

/* ------------------------------------------------------------------ */
/*  Shared classes                                                     */
/* ------------------------------------------------------------------ */

/* Official INP gradient: deep green → intermediate green → brown earth */
const INP_GRADIENT = "linear-gradient(135deg, #5E3D20 0%, #8A5E38 50%, #8B5E3C 100%)";
const INP_GRADIENT_SUBTLE = "linear-gradient(135deg, rgba(31,77,58,0.1) 0%, rgba(47,107,79,0.05) 50%, rgba(139,94,60,0.05) 100%)";

const inputBase =
    "w-full h-12 rounded-xl border border-neutral-200 bg-white px-4 text-sm text-gray-800 placeholder:text-gray-400 transition-all duration-300 focus:border-[#8A5E38] focus:ring-2 focus:ring-[#8A5E38]/20 focus:shadow-sm focus:outline-none hover:border-gray-300";

const selectBase =
    "w-full h-12 rounded-xl border border-neutral-200 bg-white px-4 text-sm text-gray-800 transition-all duration-300 focus:border-[#8A5E38] focus:ring-2 focus:ring-[#8A5E38]/20 focus:shadow-sm focus:outline-none appearance-none hover:border-gray-300";

const labelBase = "block text-[13px] font-semibold text-gray-700 mb-2.5";

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function DemandeAnalysePage() {
    const [form, setForm] = useState<FormData>(INITIAL);
    const [submitted, setSubmitted] = useState(false);
    const [reference, setReference] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const set = (key: keyof FormData, value: string) =>
        setForm((f) => ({ ...f, [key]: value }));

    /* ── Cascading territory handlers ── */

    const handleRegionChange = useCallback((value: string) => {
        setForm((f) => ({ ...f, region: value, department: "", commune: "" }));
    }, []);

    const handleDepartmentChange = useCallback((value: string) => {
        setForm((f) => ({ ...f, department: value, commune: "" }));
    }, []);

    /* ── Filtered territory lists (useMemo) ── */

    const filteredDepartments = useMemo(() => {
        if (!form.region) return [];
        const region = SENEGAL_TERRITORY.find((r) => r.name === form.region);
        return region?.departments ?? [];
    }, [form.region]);

    const filteredCommunes = useMemo(() => {
        if (!form.department) return [];
        const dept = filteredDepartments.find((d) => d.name === form.department);
        return dept?.communes ?? [];
    }, [form.department, filteredDepartments]);

    const toggleAnalysis = (type: string) =>
        setForm((f) => ({
            ...f,
            analysisTypes: f.analysisTypes.includes(type)
                ? f.analysisTypes.filter((t) => t !== type)
                : [...f.analysisTypes, type],
        }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (form.analysisTypes.length === 0) {
            setSubmitError("Veuillez sélectionner au moins un type d'analyse.");
            return;
        }

        setIsSubmitting(true);
        setSubmitError("");

        try {
            const res = await fetch("/api/demandes-analyse", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Erreur lors de l'envoi");
            }
            setReference(data.item?.reference ?? "");
            setSubmitted(true);
        } catch (error) {
            setSubmitError(
                error instanceof Error ? error.message : "Une erreur est survenue",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    /* Progress indicator (how many sections are partially filled) */
    const progress = useMemo(() => {
        let filled = 0;
        if (form.lastName || form.firstName || form.phone || form.email) filled++;
        if (form.region || form.department || form.commune) filled++;
        if (form.culturePlanned || form.cultureCurrent || form.problem) filled++;
        if (form.analysisTypes.length > 0) filled++;
        if (form.samplesNumber || form.sendMode || form.depositDate) filled++;
        return Math.round((filled / 5) * 100);
    }, [form]);

    /* ── Success ── */

    if (submitted) {
        return (
            <main className="min-h-screen bg-white">
                <PageHero
                    label="Institut National de Pédologie"
                    title="Demande d'Analyse de Sol"
                    subtitle="Votre demande a été soumise avec succès."
                />
                <section className="py-32 text-center">
                    <div className="max-w-lg mx-auto px-6">
                        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-[#EADFC9] shadow-inner">
                            <CheckCircle2 className="h-12 w-12 text-[var(--inp-vert)]" />
                        </div>
                        <h2 className="text-3xl font-bold text-[#5E3D20] mb-4">
                            Demande enregistrée
                        </h2>
                        <p className="text-gray-600 leading-relaxed mb-3">
                            Votre demande d&apos;analyse de sol a été transmise à notre équipe
                            scientifique.
                            {reference ? (
                                <>
                                    {" "}
                                    Votre numéro de dossier est{" "}
                                    <strong className="font-mono">{reference}</strong>.
                                </>
                            ) : (
                                <>
                                    {" "}
                                    Un numéro de dossier vous sera communiqué par email
                                    dans les <strong>48 heures</strong>.
                                </>
                            )}
                        </p>
                        <p className="text-sm text-gray-400 mb-10">
                            Conservez votre email de confirmation comme référence.
                        </p>
                        <a
                            href="/"
                            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#5E3D20] to-[#8A5E38] px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-white shadow-lg transition-all hover:shadow-xl hover:brightness-110"
                        >
                            Retour à l&apos;accueil
                            <ArrowRight className="h-4 w-4" />
                        </a>
                    </div>
                </section>
            </main>
        );
    }

    /* ── Form ── */

    return (
        <main className="min-h-screen bg-white">
            <PageHero
                label="Institut National de Pédologie"
                title="Demande d'Analyse de Sol"
                subtitle="Formulaire officiel de soumission d'échantillons pour analyse pédologique scientifique."
            />

            {/* ── Process steps ── */}
            <section className="py-16 bg-gradient-to-b from-[#F7F1E6]/60 to-transparent">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                step: "01",
                                icon: Sprout,
                                title: "Prélèvement terrain",
                                desc: "Collectez vos échantillons selon les normes pédologiques.",
                            },
                            {
                                step: "02",
                                icon: FlaskConical,
                                title: "Analyse en laboratoire",
                                desc: "Nos experts analysent vos sols avec un équipement de pointe.",
                            },
                            {
                                step: "03",
                                icon: TestTubes,
                                title: "Rapport & recommandations",
                                desc: "Recevez un rapport détaillé avec des recommandations agronomiques.",
                            },
                        ].map((item) => (
                            <div
                                key={item.step}
                                className="relative flex flex-col items-center text-center p-8 rounded-3xl border border-[#EADFC9] bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-xl hover:border-[#DCC8A8] transition-all duration-500 group"
                            >
                                <span className="absolute top-4 left-5 text-5xl font-black text-[#EADFC9]/80 group-hover:text-[#DCC8A8] transition-colors duration-500">
                                    {item.step}
                                </span>
                                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg group-hover:scale-105 transition-transform duration-300" style={{ background: INP_GRADIENT }}>
                                    <item.icon className="h-7 w-7 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-[#5E3D20] mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Form Section ── */}
            <section className="pb-24 pt-8">
                <div className="max-w-4xl mx-auto px-6">

                    {/* ── Scientific info banner ── */}
                    <div className="relative overflow-hidden rounded-2xl p-8 md:p-10 mb-14 shadow-lg bg-gradient-to-r from-[#5E3D20] via-[#8A5E38] to-[#8A5E38]">
                        <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3" />
                        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />
                        <div className="relative z-10 flex items-start gap-5">
                            <div className="hidden sm:flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md shadow-sm border border-white/20">
                                <ShieldCheck className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">
                                    Procédure officielle — Protocole national
                                </h3>
                                <p className="text-sm text-[#F7F1E6]/90 leading-relaxed max-w-2xl">
                                    Les échantillons doivent être prélevés à une profondeur de 0-30 cm,
                                    dans un rayon représentatif de la parcelle. Chaque échantillon doit peser
                                    entre 500 g et 1 kg, conditionné dans un sac plastique étiqueté. Consultez
                                    notre <span className="underline text-white font-medium hover:text-[#EADFC9] transition-colors cursor-pointer">guide de prélèvement</span> pour
                                    des instructions détaillées.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ── Progress bar ── */}
                    <div className="mb-12">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                                Progression du formulaire
                            </span>
                            <span className="text-xs font-bold text-[var(--inp-vert)]">
                                {progress}%
                            </span>
                        </div>
                        <div className="w-full h-3 bg-neutral-200 rounded-full overflow-hidden shadow-inner">
                            <div
                                className="h-full bg-gradient-to-r from-[#5E3D20] via-[#8A5E38] to-[#8B5E3C] rounded-full transition-all duration-700 ease-in-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-10">

                        {/* ═══════════ SECTION 1: Demandeur ═══════════ */}
                        <FormCard>
                            <SectionHeader icon={User} title="Informations du demandeur" number="1" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <Field label="Nom" required>
                                    <input required className={inputBase} placeholder="Votre nom" value={form.lastName} onChange={(e) => set("lastName", e.target.value)} />
                                </Field>
                                <Field label="Prénom" required>
                                    <input required className={inputBase} placeholder="Votre prénom" value={form.firstName} onChange={(e) => set("firstName", e.target.value)} />
                                </Field>
                                <Field label="Téléphone" required>
                                    <input required type="tel" className={inputBase} placeholder="+221 7X XXX XX XX" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
                                </Field>
                                <Field label="Email" required>
                                    <input required type="email" className={inputBase} placeholder="votre@email.sn" value={form.email} onChange={(e) => set("email", e.target.value)} />
                                </Field>
                                <div className="md:col-span-2">
                                    <Field label="Type de demandeur" required>
                                        <select required className={selectBase} value={form.requesterType} onChange={(e) => set("requesterType", e.target.value)}>
                                            <option value="">— Sélectionner —</option>
                                            {REQUESTER_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </Field>
                                </div>
                            </div>
                        </FormCard>

                        {/* ═══════════ SECTION 2: Localisation ═══════════ */}
                        <FormCard>
                            <SectionHeader icon={MapPin} title="Localisation du site" number="2" />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
                                {/* Région */}
                                <Field label="Région" required>
                                    <select
                                        required
                                        className={selectBase}
                                        value={form.region}
                                        onChange={(e) => handleRegionChange(e.target.value)}
                                    >
                                        <option value="">— Sélectionner une région —</option>
                                        {SENEGAL_TERRITORY.map((r) => (
                                            <option key={r.name} value={r.name}>
                                                {r.name}
                                            </option>
                                        ))}
                                    </select>
                                </Field>

                                {/* Département (cascading) */}
                                <Field label="Département" required>
                                    <div className="relative">
                                        <select
                                            required
                                            disabled={!form.region}
                                            className={`${selectBase} ${!form.region ? "opacity-50 cursor-not-allowed bg-gray-50" : ""}`}
                                            value={form.department}
                                            onChange={(e) => handleDepartmentChange(e.target.value)}
                                        >
                                            <option value="">
                                                {form.region ? "— Sélectionner un département —" : "Choisissez d'abord une région"}
                                            </option>
                                            {filteredDepartments.map((d) => (
                                                <option key={d.name} value={d.name}>
                                                    {d.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </Field>

                                {/* Commune (cascading) */}
                                <Field label="Commune" required>
                                    <div className="relative">
                                        <select
                                            required
                                            disabled={!form.department}
                                            className={`${selectBase} ${!form.department ? "opacity-50 cursor-not-allowed bg-gray-50" : ""}`}
                                            value={form.commune}
                                            onChange={(e) => set("commune", e.target.value)}
                                        >
                                            <option value="">
                                                {form.department ? "— Sélectionner une commune —" : "Choisissez d'abord un département"}
                                            </option>
                                            {filteredCommunes.map((c) => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                    </div>
                                </Field>
                            </div>

                            {/* Second row: surface, GPS */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6 mt-8 pt-6 border-t border-[#EADFC9]/40">
                                <Field label="Superficie (ha)">
                                    <input type="number" step="0.01" className={inputBase} placeholder="ex: 5.5" value={form.surface} onChange={(e) => set("surface", e.target.value)} />
                                </Field>
                                <Field label="Latitude">
                                    <input className={inputBase} placeholder="ex: 14.6928" value={form.latitude} onChange={(e) => set("latitude", e.target.value)} />
                                </Field>
                                <Field label="Longitude">
                                    <input className={inputBase} placeholder="ex: -17.4467" value={form.longitude} onChange={(e) => set("longitude", e.target.value)} />
                                </Field>
                            </div>
                        </FormCard>

                        {/* ═══════════ SECTION 3: Parcelle ═══════════ */}
                        <FormCard>
                            <SectionHeader icon={Sprout} title="Informations sur la parcelle" number="3" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <Field label="Culture prévue">
                                    <input className={inputBase} placeholder="ex: Arachide, Mil, Riz…" value={form.culturePlanned} onChange={(e) => set("culturePlanned", e.target.value)} />
                                </Field>
                                <Field label="Culture actuelle">
                                    <input className={inputBase} placeholder="ex: Jachère, Maïs…" value={form.cultureCurrent} onChange={(e) => set("cultureCurrent", e.target.value)} />
                                </Field>
                                <Field label="Historique fertilisation">
                                    <input className={inputBase} placeholder="ex: Engrais NPK 2024…" value={form.fertilisationHistory} onChange={(e) => set("fertilisationHistory", e.target.value)} />
                                </Field>
                                <Field label="Irrigation">
                                    <select className={selectBase} value={form.irrigation} onChange={(e) => set("irrigation", e.target.value)}>
                                        <option value="">— Sélectionner —</option>
                                        <option value="oui">Oui</option>
                                        <option value="non">Non</option>
                                    </select>
                                </Field>
                                <div className="md:col-span-2">
                                    <Field label="Problème constaté">
                                        <textarea
                                            className={`${inputBase} h-auto min-h-[120px] py-3 resize-y`}
                                            placeholder="Décrivez le problème observé (baisse de rendement, salinité, acidité, érosion…)"
                                            value={form.problem}
                                            onChange={(e) => set("problem", e.target.value)}
                                            rows={4}
                                        />
                                    </Field>
                                </div>
                            </div>
                        </FormCard>

                        {/* ═══════════ SECTION 4: Type d'analyse ═══════════ */}
                        <FormCard>
                            <SectionHeader icon={FlaskConical} title="Type d'analyse demandée" number="4" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {ANALYSIS_TYPE_OPTIONS.map((opt) => {
                                    const checked = form.analysisTypes.includes(opt.label);
                                    return (
                                        <label
                                            key={opt.label}
                                            className={`group relative flex items-start gap-4 cursor-pointer rounded-2xl border-2 p-5 transition-all duration-300 ${checked
                                                ? "border-[#5E3D20] bg-[#F7F1E6] shadow-md"
                                                : "border-neutral-100 bg-white hover:border-[#8A5E38] hover:shadow-md"
                                                }`}
                                        >
                                            {/* Custom checkbox */}
                                            <div className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border-2 transition-all duration-200 ${checked
                                                ? "border-[#5E3D20] bg-[#5E3D20]"
                                                : "border-gray-300 group-hover:border-[#8A5E38]"
                                                }`}>
                                                {checked && (
                                                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={checked}
                                                onChange={() => toggleAnalysis(opt.label)}
                                                className="sr-only"
                                            />
                                            <div>
                                                <span className={`text-sm font-semibold block transition-colors ${checked ? "text-[#5E3D20]" : "text-gray-700 group-hover:text-gray-900"}`}>
                                                    {opt.label}
                                                </span>
                                                <span className="text-xs text-gray-500 mt-0.5 block">
                                                    {opt.desc}
                                                </span>
                                            </div>
                                        </label>
                                    );
                                })}
                            </div>
                        </FormCard>

                        {/* ═══════════ SECTION 5: Logistique ═══════════ */}
                        <FormCard accent logistic>
                            <SectionHeader icon={Package} title="Logistique & envoi" number="5" />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
                                <Field label="Nombre d'échantillons">
                                    <input type="number" min="1" className={inputBase} placeholder="ex: 3" value={form.samplesNumber} onChange={(e) => set("samplesNumber", e.target.value)} />
                                </Field>
                                <Field label="Mode d'envoi">
                                    <select className={selectBase} value={form.sendMode} onChange={(e) => set("sendMode", e.target.value)}>
                                        <option value="">— Sélectionner —</option>
                                        <option value="depot">Dépôt direct au laboratoire</option>
                                        <option value="coursier">Coursier / Transport</option>
                                        <option value="collecte">Collecte sur site (à planifier)</option>
                                    </select>
                                </Field>
                                <Field label="Date prévue">
                                    <input type="date" className={inputBase} value={form.depositDate} onChange={(e) => set("depositDate", e.target.value)} />
                                </Field>
                            </div>
                        </FormCard>

                        {/* ═══════════ Submit ═══════════ */}
                        {submitError && (
                            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                <AlertCircle className="h-4 w-4 shrink-0" />
                                {submitError}
                            </div>
                        )}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="group w-full flex items-center justify-center gap-3 rounded-xl py-4 md:py-5 text-sm font-semibold uppercase tracking-[0.15em] text-white shadow-lg bg-gradient-to-r from-[#5E3D20] via-[#8A5E38] to-[#8B5E3C] transition-all duration-300 hover:shadow-xl hover:opacity-95 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#8A5E38] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Send className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                                )}
                                {isSubmitting ? "Envoi en cours…" : "Soumettre la demande d'analyse"}
                            </button>
                            <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1.5">
                                <FileText className="h-3.5 w-3.5" />
                                Vos données sont traitées conformément à la politique de confidentialité de l&apos;INP.
                            </p>
                        </div>
                    </form>
                </div>
            </section>
        </main>
    );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function FormCard({ children, accent, logistic }: { children: React.ReactNode; accent?: boolean; logistic?: boolean }) {
    return (
        <div
            className={`rounded-2xl p-8 md:p-10 transition-all duration-300 border border-neutral-100 bg-white shadow-md hover:shadow-lg ${logistic ? "relative overflow-hidden" : ""
                }`}
        >
            {logistic && (
                <div
                    className="absolute inset-0 opacity-40 pointer-events-none"
                    style={{ background: INP_GRADIENT_SUBTLE }}
                />
            )}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}

function SectionHeader({
    icon: Icon,
    title,
    number,
}: {
    icon: React.ElementType;
    title: string;
    number: string;
}) {
    return (
        <div className="mb-8 pb-5 border-b border-neutral-100">
            <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F7F1E6] text-[#8A5E38]">
                    <Icon className="h-5 w-5" />
                </div>
                <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B5E3C]">
                        Étape {number}
                    </span>
                    <h2 className="text-xl font-bold leading-tight text-[#5E3D20]">
                        {title}
                    </h2>
                </div>
            </div>
            <div className="mt-4 h-[2px] w-12 rounded-full" style={{ background: INP_GRADIENT }} />
        </div>
    );
}

function Field({
    label,
    required,
    children,
}: {
    label: string;
    required?: boolean;
    children: React.ReactNode;
}) {
    return (
        <div>
            <label className={labelBase}>
                {label}
                {required && <span className="text-red-400 ml-1">*</span>}
            </label>
            {children}
        </div>
    );
}
