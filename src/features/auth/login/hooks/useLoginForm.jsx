// for refrences only , ignore it

// export const LoginForm({ className, ...props }) {
//   const { login, isLoading, error: authError } = useAuth();
//   const navigate = useNavigate();
//   // sambunkan ke zod resolver
//   const { register, handleSubmit, formState } = useForm({
//     resolver: zodResolver(formSchema),
//   });

//   const submittedData = async (data) => {
//     // e.preventDefault(); // supaya g reload
//     // const email = e.email; // ambil data
//     // const _password = e.password;

//     // Handle form submission here
//     // In production, you would typically send this data to an API
//     // Example: await api.login({ email, password: _password });
//     try {
//       await login(data.email, data.password); // fetch
//       navigate("/dashboard"); // redirect setelah login berhasil
//     } catch (error) {
//       // error sydah di handle di context
//       console.error("Login failed:", error);
//     }
//   };
//
import { useFormSchema } from "@/features/auth/login/form/login";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export const useLoginForm = () => {
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(useFormSchema),
  });

  const onSubmit = async (data) => {
    const response = await fetch();
  };
};
