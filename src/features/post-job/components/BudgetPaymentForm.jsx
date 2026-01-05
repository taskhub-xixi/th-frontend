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
import { DollarSign } from "lucide-react";
import { paymentTypeOptions } from "../constants";

export default function BudgetPaymentForm({ form }) {
  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
          <DollarSign className="h-5 w-5" />
          Budget & Payment
        </CardTitle>
        <CardDescription className="text-gray-600">
          Compensation details for the job
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field>
              <FieldLabel className="text-gray-900 font-medium" htmlFor="budget">
                Budget (USD) *
              </FieldLabel>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <Input
                  id="budget"
                  {...form.register("budget")}
                  placeholder="e.g., 5000"
                  type="number"
                  className={`pl-10 ${form.formState.errors.budget ? "border-red-500" : "border-gray-300"}`}
                />
              </div>
              <FieldDescription className="text-xs text-gray-500">
                Enter the total budget for this job
              </FieldDescription>
              <FieldDescription className="text-xs text-red-500">
                {form.formState.errors.budget?.message}
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel className="text-gray-900 font-medium">Payment Type</FieldLabel>
              <Select
                onValueChange={(value) => form.setValue("payment_type", value)}
                defaultValue={form.getValues("payment_type")}
              >
                <SelectTrigger
                  className={
                    form.formState.errors.payment_type ? "border-red-500" : "border-gray-300"
                  }
                >
                  <SelectValue placeholder="Select payment type" />
                </SelectTrigger>
                <SelectContent>
                  {paymentTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldDescription className="text-xs text-red-500">
                {form.formState.errors.payment_type?.message}
              </FieldDescription>
            </Field>
          </div>

          <Field>
            <FieldLabel className="text-gray-900 font-medium" htmlFor="deadline">
              Application Deadline (Optional)
            </FieldLabel>
            <Input
              id="deadline"
              {...form.register("deadline")}
              min={new Date().toISOString().split("T")[0]}
              type="date"
              className="border-gray-300"
            />
            <FieldDescription className="text-xs text-gray-500">
              Leave empty if there's no specific deadline
            </FieldDescription>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
