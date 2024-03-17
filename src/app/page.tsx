"use client";
import Image from "next/image";
import { useForm, SubmitHandler } from "react-hook-form";
import { mutation } from "../../convex/_generated/server";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Home() {
  const saveSketchMutation = useMutation(api.sketches.saveSketch);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<{
    prompt: string;
  }>();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <form
        onSubmit={handleSubmit(async (formdata) => {
          const result = await saveSketchMutation(formdata);

          console.log(result);
        })}
      >
        {/* register your input into the hook by invoking the "register" function */}
        <input
          className="text-black"
          {...register("prompt", {
            required: "enter prompt",
          })}
        />
        {errors.prompt && <span>This field is required</span>}

        <input type="submit" />
      </form>
    </main>
  );
}
