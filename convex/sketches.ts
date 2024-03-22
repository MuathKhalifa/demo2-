import { internalActionGeneric } from "convex/server";
import { internal } from "./_generated/api";
import {
  internalAction,
  internalMutation,
  mutation,
  query,
} from "./_generated/server";
import { v } from "convex/values";

import Replicate from "replicate";
const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

export const saveSketch = mutation({
  args: { prompt: v.string(), image: v.string() },
  handler: async (ctx, args) => {
    const { prompt, image } = args;
    const sketch = await ctx.db.insert("sketches", {
      prompt,
    });

    console.log("sketch: ", sketch);

    await ctx.scheduler.runAfter(0, internal.sketches.generate, {
      sketchId: sketch,
      prompt,
      image,
    });

    return {
      message: "success",
    };
  },
});

export const generate = internalAction(
  async (
    { runMutation },
    {
      prompt,
      image,
      sketchId,
    }: { sketchId: any; prompt: string; image: string }
  ) => {
    console.log("running replicate..............");
    const input = {
      image,
      scale: 7,
      prompt,
      image_resolution: "512",
      n_prompt:
        "longbody, lowers, bad anatomy, bad hand, missing finger, extra digit",
    };

    const output = (await replicate.run(
      "tencentarc/gfpgan:0fbacf7afc6c144e5be9767cff80f25aff23e52b0708f17e20f9879b2f21516c",
      { input }
    )) as [string, string];
    console.log(output);

    runMutation(internal.sketches.updateSketchResult, {
      sketchId,
      result: output[1],
    });
    //=> "https://replicate.deliv
    //implement
  }
);

// export const getSketch = query({
//   args: { sketchId: v.id("sketches") },
//   handler: (ctx, { sketchId }) => {
//     if (!sketchId) return null;
//     return ctx.db.get(sketchId);
//   },
// });

export const updateSketchResult = internalMutation({
  args: { sketchId: v.id("sketches"), result: v.string() },
  handler: async (ctx, { sketchId, result }) => {
    await ctx.db.patch(sketchId, {
      result,
    });
  },
});

export const getSketches = query({
  handler: async (ctx) => {
    const sketches = await ctx.db.query("sketches").collect();
    return sketches;
  },
});
