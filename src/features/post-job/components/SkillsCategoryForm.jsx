"use client";
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
import { Building, Tag } from "lucide-react";
import { useEffect, useState } from "react";
import { categoriesApi } from "@/lib/api/categories";

export default function SkillsCategoryForm({ form }) {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoriesApi.getAllCategories();
        if (response.success && response.categories) {
          setCategories(response.categories);
        }
      } catch (error) {
        console.error("Failed to load categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
          <Tag className="h-5 w-5" />
          Skills & Category
        </CardTitle>
        <CardDescription className="text-gray-600">
          Required skills and job classification
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel className="text-gray-900 font-medium" htmlFor="skills">
              Required Skills
            </FieldLabel>
            <Input
              id="skills"
              {...form.register("skills")}
              placeholder="e.g., React, Node.js, UI Design, Project Management, Figma"
              className={form.formState.errors.skills ? "border-red-500" : "border-gray-300"}
            />
            <FieldDescription className="text-xs text-gray-500">
              Separate skills with commas. These help taskers find your job.
            </FieldDescription>
            <FieldDescription className="text-xs text-red-500">
              {form.formState.errors.skills?.message}
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel className="text-gray-900 font-medium">Job Category</FieldLabel>
            <Select
              disabled={loadingCategories}
              onValueChange={(value) => form.setValue("category", value)}
              defaultValue={form.getValues("category")}
            >
              <SelectTrigger
                className={form.formState.errors.category ? "border-red-500" : "border-gray-300"}
              >
                <SelectValue
                  placeholder={loadingCategories ? "Loading categories..." : "Select a category"}
                />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldDescription className="text-xs text-red-500">
              {form.formState.errors.category?.message}
            </FieldDescription>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
