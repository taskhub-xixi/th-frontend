import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldGroup, FieldLabel, FieldDescription } from "@/components/ui/field";
import { Calendar, Globe, MapPin, Users } from "lucide-react";
import { commitmentOptions, experienceLevelOptions, workTypeOptions } from "../constants";

export default function LocationWorkSetupForm({ form }) {
  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
          <MapPin className="h-5 w-5" />
          Location & Work Setup
        </CardTitle>
        <CardDescription className="text-gray-600">
          Where and how the work will be done
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field>
              <FieldLabel className="text-gray-900 font-medium">Work Type</FieldLabel>
              <Select
                onValueChange={(value) => form.setValue("work_type", value)}
                defaultValue={form.getValues("work_type")}
              >
                <SelectTrigger
                  className={form.formState.errors.work_type ? "border-red-500" : "border-gray-300"}
                >
                  <SelectValue placeholder="Select work type" />
                </SelectTrigger>
                <SelectContent>
                  {workTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldDescription className="text-xs text-red-500">
                {form.formState.errors.work_type?.message}
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel className="text-gray-900 font-medium" htmlFor="location">
                Location
              </FieldLabel>
              <Input
                id="location"
                {...form.register("location")}
                placeholder="e.g., Jakarta, Remote, Worldwide"
                className={form.formState.errors.location ? "border-red-500" : "border-gray-300"}
              />
              <FieldDescription className="text-xs text-red-500">
                {form.formState.errors.location?.message}
              </FieldDescription>
            </Field>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field>
              <FieldLabel className="text-gray-900 font-medium">Commitment</FieldLabel>
              <Select
                onValueChange={(value) => form.setValue("commitment", value)}
                defaultValue={form.getValues("commitment")}
              >
                <SelectTrigger
                  className={
                    form.formState.errors.commitment ? "border-red-500" : "border-gray-300"
                  }
                >
                  <SelectValue placeholder="Select commitment" />
                </SelectTrigger>
                <SelectContent>
                  {commitmentOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldDescription className="text-xs text-red-500">
                {form.formState.errors.commitment?.message}
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel className="text-gray-900 font-medium">Experience Level</FieldLabel>
              <Select
                onValueChange={(value) => form.setValue("experience_level", value)}
                defaultValue={form.getValues("experience_level")}
              >
                <SelectTrigger
                  className={
                    form.formState.errors.experience_level ? "border-red-500" : "border-gray-300"
                  }
                >
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  {experienceLevelOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldDescription className="text-xs text-red-500">
                {form.formState.errors.experience_level?.message}
              </FieldDescription>
            </Field>
          </div>
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
