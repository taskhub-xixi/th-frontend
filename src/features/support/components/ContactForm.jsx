import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function ContactForm({ formData, setFormData, loading, onSubmit }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Support Ticket</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <Label htmlFor="subject">Subject *</Label>
            <Input
              id="subject"
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="Summarize your issue..."
              required
              value={formData.subject}
            />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your issue in detail..."
              required
              rows={6}
              value={formData.description}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                value={formData.category}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="general">General</option>
                <option value="billing">Billing</option>
                <option value="technical">Technical</option>
                <option value="account">Account</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <Label htmlFor="priority">Priority</Label>
              <select
                id="priority"
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                value={formData.priority}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <Button disabled={loading} type="submit">
            {loading ? "Submitting..." : "Submit Ticket"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}