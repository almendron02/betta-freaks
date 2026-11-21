"use client";

import { useActionState } from "react";

import { updateProfile } from "@/app/account/actions";
import {
  initialProfileFormState,
  type ProfileFormState,
} from "@/lib/auth/profile";

export function ProfileForm({
  fullName,
  phone,
}: {
  fullName: string | null;
  phone: string | null;
}) {
  const [state, action, pending] = useActionState<ProfileFormState, FormData>(
    updateProfile,
    initialProfileFormState,
  );

  return (
    <form className="form-stack account-profile-form" action={action}>
      <div className="field">
        <label htmlFor="fullName">Name</label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          autoComplete="name"
          defaultValue={fullName ?? ""}
          aria-describedby={state.errors?.fullName ? "fullName-error" : undefined}
        />
        {state.errors?.fullName ? <span className="field-error" id="fullName-error">{state.errors.fullName[0]}</span> : null}
      </div>
      <div className="field">
        <label htmlFor="phone">Phone</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          defaultValue={phone ?? ""}
          aria-describedby={state.errors?.phone ? "phone-error" : "phone-hint"}
        />
        {state.errors?.phone ? (
          <span className="field-error" id="phone-error">{state.errors.phone[0]}</span>
        ) : (
          <span className="field-hint" id="phone-hint">Optional. Used only for order and delivery communication.</span>
        )}
      </div>
      <button className="button button-dark" type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save profile"}
      </button>
      {state.message ? (
        <p className={`form-message ${state.status === "error" ? "form-message-error" : "form-message-success"}`} role="status">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
