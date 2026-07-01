"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "../_components/header";
import Button from "@/app/components/button";

type FormFields = {
    title: string;
    company: string;
    location: string;
    salary: string;
    salaryMin: string;
    salaryMax: string;
    url: string;
    postDate: string;
    description: string;
    source: string;
};

type FormErrors = Partial<Record<keyof FormFields, string>>;

const EMPTY_FORM: FormFields = {
    title: "",
    company: "",
    location: "",
    salary: "",
    salaryMin: "",
    salaryMax: "",
    url: "",
    postDate: "",
    description: "",
    source: "",
};

function validate(fields: FormFields): FormErrors {
    const errors: FormErrors = {};
    if (!fields.title.trim()) errors.title = "Job title is required.";
    if (!fields.company.trim()) errors.company = "Company is required.";
    if (!fields.description.trim()) errors.description = "Job description is required.";
    if (fields.url && !/^https?:\/\/.+/.test(fields.url.trim())) {
        errors.url = "Enter a valid URL (must start with http or https).";
    }
    return errors;
}

export default function CreateJobForm() {
    const router = useRouter();
    const [fields, setFields] = useState<FormFields>(EMPTY_FORM);
    const [errors, setErrors] = useState<FormErrors>({});
    const [submitting, setSubmitting] = useState(false);
    const [serverError, setServerError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFields((prev) => ({ ...prev, [name]: value }));
        // Clear error on change
        if (errors[name as keyof FormFields]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setServerError("");

        const validationErrors = validate(fields);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setSubmitting(true);
        try {
            console.log("🚀 ~ handleSubmit ~ fields:", fields)
            const res = await fetch("/api/jobs/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(fields),
            });

            const data = await res.json();

            if (!res.ok) {
                setServerError(data.error || "Something went wrong.");
                return;
            }

            // Navigate to the job page (or wherever you list jobs)
            router.push(`/jobs?_id=${data.jobId}`);
        } catch {
            setServerError("Network error. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen">
            <Header />
            <div className="px-4 py-4">
                <div className="max-w-2xl mx-auto bg-(--primary) p-6 rounded-lg shadow-md">
                    <h1 className="text-2xl font-semibold text-(--secondary) mb-1">Add a Job</h1>
                    <p className="text-sm text--(--secondary) mb-8">
                        Fill in the job details. Required fields are marked with{" "}
                        <span className="text-red-700">*</span>.
                    </p>

                    {serverError && (
                        <div className="mb-6 rounded-md bg-red-950 border border-red-800 px-4 py-3 text-sm text-red-300">
                            {serverError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate className="space-y-5">
                        {/* Title & Company */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <Field
                                label="Job Title"
                                name="title"
                                required
                                value={fields.title}
                                error={errors.title}
                                onChange={handleChange}
                                placeholder="e.g. Senior Full-Stack Developer"
                            />
                            <Field
                                label="Company"
                                name="company"
                                required
                                value={fields.company}
                                error={errors.company}
                                onChange={handleChange}
                                placeholder="e.g. Acme Corp"
                            />
                        </div>

                        {/* Location & Source */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <Field
                                label="Location"
                                name="location"
                                value={fields.location}
                                onChange={handleChange}
                                placeholder="e.g. Karachi / Remote"
                            />
                            <Field
                                label="Source"
                                name="source"
                                value={fields.source}
                                onChange={handleChange}
                                placeholder="e.g. LinkedIn, Rozee.pk"
                            />
                        </div>

                        {/* Salary */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                            <Field
                                label="Salary (display)"
                                name="salary"
                                value={fields.salary}
                                onChange={handleChange}
                                placeholder="e.g. PKR 150k–200k"
                            />
                            <Field
                                label="Salary Min"
                                name="salaryMin"
                                value={fields.salaryMin}
                                onChange={handleChange}
                                placeholder="e.g. 150000"
                            />
                            <Field
                                label="Salary Max"
                                name="salaryMax"
                                value={fields.salaryMax}
                                onChange={handleChange}
                                placeholder="e.g. 200000"
                            />
                        </div>

                        {/* URL & Post Date */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <Field
                                label="Job URL"
                                name="url"
                                type="url"
                                value={fields.url}
                                error={errors.url}
                                onChange={handleChange}
                                placeholder="https://..."
                            />
                            <Field
                                label="Post Date"
                                name="postDate"
                                type="date"
                                value={fields.postDate}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Description */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-(--secondary)" htmlFor="description">
                                Job Description <span className="text-red-400">*</span>
                            </label>
                            <textarea
                                name="description"
                                rows={8}
                                value={fields.description}
                                onChange={handleChange}
                                placeholder="Paste the full job description here..."
                                className={`w-full rounded-md bg-(--secondary) border px-3 py-2 text-sm text-(--primary) placeholder-(--primary)/50 resize-y
                                focus:outline-none focus:ring-2 focus:ring-(--secondary)/40
                                ${errors.description ? "border-red-700" : "border-(--secondary)"}`}
                            />
                            {errors.description && (
                                <p className="text-xs text-red-700">{errors.description}</p>
                            )}
                        </div>

                        {/* Submit */}
                        <div className="pt-2">
                            <Button title={submitting ? "Saving..." : "Save Job"} type="submit" disabled={submitting} />
                        </div>
                    </form>
                </div>
            </div>
            <div className="fixed bottom-4 right-4">
                <Link href="/jobs" className="bg-(--primary) text-(--secondary) px-4 py-2 rounded shadow hover:opacity-90 transition"
                    title="Back to jobs"
                >
                    Back
                </Link>
            </div>
        </div>
    );
}

// ---------- Reusable field ----------

type FieldProps = {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    required?: boolean;
    placeholder?: string;
    type?: string;
};

function Field({ label, name, value, onChange, error, required, placeholder, type = "text" }: FieldProps) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-(--secondary)" htmlFor={name}>
                {label} {required && <span className="text-red-700">*</span>}
            </label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full rounded-md bg-(--secondary) border px-3 py-2 text-sm text-(--primary) placeholder-(--primary)/50
                    focus:outline-none focus:ring-2 focus:ring-(--secondary)/40
                    ${error ? "border-red-700" : "border-gray-700"}`}
            />
            {error && <p className="text-xs text-red-700">{error}</p>}
        </div>
    );
}