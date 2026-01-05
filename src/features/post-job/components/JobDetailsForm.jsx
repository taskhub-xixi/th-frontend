import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldGroup, FieldLabel, FieldDescription } from "@/components/ui/field";
import { Briefcase } from "lucide-react";

export default function JobDetailsForm({ form }) {
  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
          <Briefcase className="h-5 w-5" />
          Job Details
        </CardTitle>
        <CardDescription className="text-gray-600">
          Basic information about the position
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel className="text-gray-900 font-medium" htmlFor="title">
              Job Title *
            </FieldLabel>
            <Input
              id="title"
              {...form.register("title")}
              placeholder="e.g., Frontend Developer, UI/UX Designer, Product Manager"
              className={form.formState.errors.title ? "border-red-500" : "border-gray-300"}
            />
            <FieldDescription className="text-xs text-gray-500">
              Be specific about the role. What will the tasker be doing?
            </FieldDescription>
            <FieldDescription className="text-xs text-red-500">
              {form.formState.errors.title?.message}
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel className="text-gray-900 font-medium" htmlFor="description">
              Job Description *
            </FieldLabel>
            <Textarea
              id="description"
              {...form.register("description")}
              placeholder="Describe the role, responsibilities, requirements, and what makes this job great..."
              rows={6}
              className={`min-h-[200px] ${form.formState.errors.description ? "border-red-500" : "border-gray-300"}`}
            />
            <FieldDescription className="text-xs text-gray-500">
              Include details about the project, expected deliverables, and any special
              requirements. Minimum 10 characters required.
            </FieldDescription>
            <FieldDescription className="text-xs text-red-500">
              {form.formState.errors.description?.message}
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel className="text-gray-900 font-medium" htmlFor="additional_info">
              Additional Information
            </FieldLabel>
            <Textarea
              id="additional_info"
              {...form.register("additional_info")}
              placeholder="Any extra details, company culture, team information, or benefits..."
              rows={3}
              className="border-gray-300 min-h-[100px]"
            />
            <FieldDescription className="text-xs text-red-500">
              {form.formState.errors.additional_info?.message}
            </FieldDescription>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
