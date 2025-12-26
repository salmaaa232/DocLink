import { useState } from "react";
import { toast } from "sonner";

/**
 * useFetch(cb)
 * A small helper hook to run an async function and track:
 * - data:   the successful result
 * - loading: request in progress or not
 * - error:  the thrown error (if any)
 *
 * cb: an async function you pass in (ex: fetchUsers, login, createPost)
 */
const useFetch = (cb) => {
  // Stores the last successful response from cb()
  const [data, setData] = useState(undefined);

  // true while cb() is running, false otherwise
  const [loading, setLoading] = useState(false);

  // Stores the last error thrown by cb()
  const [error, setError] = useState(null);

  /**
   * fn(...args)
   * Call this to run cb(...args)
   * Example: fn() or fn(id) or fn(email, password)
   */
  const fn = async (...args) => {
    setLoading(true);   // start loading
    setError(null);     // clear previous error

    try {
      // run the async callback and save the result
      const response = await cb(...args);
      setData(response);
    } catch (err) {
      // save error + show toast message
      setError(err);
      toast.error(err?.message || "Something went wrong");
    } finally {
      setLoading(false); // stop loading (success or fail)
    }
  };

  // return state + runner + optional setData for manual updates
  return { data, loading, error, fn, setData };
};

export default useFetch;
