"use client";
import Image from "next/image";
import { useForm, SubmitHandler } from "react-hook-form";
import { mutation } from "../../convex/_generated/server";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";
import { useRef } from "react";

export default function Home() {
  const canvasRef = useRef<ReactSketchCanvasRef>(null);
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
        className="flex flex-col gap-2"
        onSubmit={handleSubmit(async (formdata) => {
          if (!canvasRef.current) return;
          const image = await canvasRef.current.exportImage("jpeg");
          console.log("img: ", image);
          const result = await saveSketchMutation({ ...formdata, image });
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

        <ReactSketchCanvas
          ref={canvasRef}
          style={{ width: 256, height: 256 }}
          width="600"
          height="400"
          strokeWidth={4}
          strokeColor="black"
        />

        <input className="bg-blue-400 rounded cursor-pointer" type="submit" />
        <button
          onClick={() => {
            console.log("er");
            canvasRef.current?.undo;
          }}
          className="bg-blue-400 rounded cursor-pointer"
          type="button"
        >
          Reset
        </button>
      </form>
    </main>
  );
}
