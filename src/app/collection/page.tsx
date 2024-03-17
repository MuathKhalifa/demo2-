"use client";
import Image from "next/image";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function Home() {
  const saveSketchMutation = useQuery(api.sketches.getSketches);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {saveSketchMutation?.map((sketch) => (
        <div key={sketch._id}>{sketch.prompt}</div>
      ))}
    </main>
  );
}
