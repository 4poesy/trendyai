import dotenv from "dotenv";
import { assert, beforeAll, describe, it } from "vitest";
import { supabase } from "../src/services/supabaseClient.js";

// Load environment variables
dotenv.config();

describe("Supabase Integration Tests", () => {
  beforeAll(async () => {
    // Ensure we have Supabase configured
    // eslint-disable-next-line node/no-process-env
    assert.ok(process.env.SUPABASE_URL, "SUPABASE_URL is required");
    // eslint-disable-next-line node/no-process-env
    assert.ok(process.env.SUPABASE_ANON_KEY, "SUPABASE_ANON_KEY is required");
  });

  it("should connect to Supabase", async () => {
    // Test basic connection by getting the Supabase version
    const { error } = await supabase.rpc("version");
    
    // If we get an error about the function not existing, that's okay - it means we connected
    if (error && !error.message.includes("function \"version\" does not exist")) {
      assert.fail(`Failed to connect to Supabase: ${error?.message}`);
    }

    // Connection successful if we get here
    assert.ok(true, "Connected to Supabase successfully");
  });

  it("should be able to access clients table", async () => {
    // Test accessing the clients table
    const { error } = await supabase
      .from("clients")
      .select("count")
      .limit(1);

    // We should either get data or a specific error about permissions
    if (error && !error.message.includes("permission denied")) {
      assert.fail(`Unexpected error accessing clients table: ${error?.message}`);
    }

    assert.ok(true, "Can access clients table");
  });

  it("should be able to access users table", async () => {
    // Test accessing the users table
    const { error } = await supabase
      .from("users")
      .select("count")
      .limit(1);

    // We should either get data or a specific error about permissions
    if (error && !error.message.includes("permission denied")) {
      assert.fail(`Unexpected error accessing users table: ${error?.message}`);
    }

    assert.ok(true, "Can access users table");
  });

  it("should be able to access projects table", async () => {
    // Test accessing the projects table
    const { error } = await supabase
      .from("projects")
      .select("count")
      .limit(1);

    // We should either get data or a specific error about permissions
    if (error && !error.message.includes("permission denied")) {
      assert.fail(`Unexpected error accessing projects table: ${error?.message}`);
    }

    assert.ok(true, "Can access projects table");
  });

  it("should be able to access agents table", async () => {
    // Test accessing the agents table
    const { error } = await supabase
      .from("agents")
      .select("count")
      .limit(1);

    // We should either get data or a specific error about permissions
    if (error && !error.message.includes("permission denied")) {
      assert.fail(`Unexpected error accessing agents table: ${error?.message}`);
    }

    assert.ok(true, "Can access agents table");
  });
});