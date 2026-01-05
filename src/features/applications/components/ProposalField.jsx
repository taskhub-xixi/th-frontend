"use client";

import { Field, FieldLabel, FieldDescription, FieldGroup } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

const ProposalField = ({ register, error }) => {
  return (
    <Field>
      <FieldLabel required>Proposal</FieldLabel>

      <FieldGroup>
        <Textarea
          {...register("proposal")}
          placeholder="Describe your approach, experience, and why you're a good fit..."
          rows={6}
        />
      </FieldGroup>

      <FieldDescription>Minimum 10 characters, maximum 1000 characters</FieldDescription>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </Field>
  );
};

export default ProposalField;
