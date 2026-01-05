"use client";

import { Field, FieldLabel, FieldDescription, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const BudgetField = ({ register, error }) => {
  return (
    <Field>
      <FieldLabel>Proposed Budget (Optional)</FieldLabel>

      <FieldGroup>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <Input
            {...register("proposed_budget")}
            className="pl-8"
            min="0"
            placeholder="e.g. 450"
            step="0.01"
            type="number"
          />
        </div>
      </FieldGroup>

      <FieldDescription>Leave empty to accept the job's budget</FieldDescription>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </Field>
  );
};

export default BudgetField;
