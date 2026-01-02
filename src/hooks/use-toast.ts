import * as React from "react";
import type { ToastActionElement, ToastProps } from "@/components/ui/toast";

// ========================================
// OPTIMIZED TOAST HOOK
// ========================================

const TOAST_LIMIT = 3; // Increased from 1 for better UX
const TOAST_REMOVE_DELAY = 5000; // Reduced from 1000000 (way too long!)

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type ActionType = typeof actionTypes;

type Action =
  | {
      type: ActionType["ADD_TOAST"];
      toast: ToasterToast;
    }
  | {
      type: ActionType["UPDATE_TOAST"];
      toast: Partial<ToasterToast>;
    }
  | {
      type: ActionType["DISMISS_TOAST"];
      toastId?: ToasterToast["id"];
    }
  | {
      type: ActionType["REMOVE_TOAST"];
      toastId?: ToasterToast["id"];
    };

interface State {
  toasts: ToasterToast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case "DISMISS_TOAST": {
      const { toastId } = action;

      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      };
    }
    
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
};

const listeners: Array<(state: State) => void> = [];

let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

type Toast = Omit<ToasterToast, "id">;

// ========================================
// HELPER FUNCTIONS FOR COMMON TOASTS
// ========================================
function createToast({ ...props }: Toast) {
  const id = genId();

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    });
    
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  return {
    id: id,
    dismiss,
    update,
  };
}

// Success toast helper
function success(title: string, description?: string) {
  return createToast({
    title,
    description,
    variant: "default" as any,
  });
}

// Error toast helper
function error(title: string, description?: string) {
  return createToast({
    title,
    description,
    variant: "destructive" as any,
  });
}

// Info toast helper
function info(title: string, description?: string) {
  return createToast({
    title,
    description,
  });
}

// Warning toast helper
function warning(title: string, description?: string) {
  return createToast({
    title: "⚠️ " + title,
    description,
  });
}

// Loading toast helper
function loading(title: string, description?: string) {
  return createToast({
    title: "⏳ " + title,
    description,
    duration: Infinity, // Don't auto-dismiss loading toasts
  });
}

// Promise toast helper
async function promise<T>(
  promise: Promise<T>,
  {
    loading: loadingMsg,
    success: successMsg,
    error: errorMsg,
  }: {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((error: any) => string);
  }
) {
  const loadingToast = loading(loadingMsg);

  try {
    const data = await promise;
    loadingToast.dismiss();
    success(
      typeof successMsg === "function" ? successMsg(data) : successMsg
    );
    return data;
  } catch (err: any) {
    loadingToast.dismiss();
    error(
      typeof errorMsg === "function" ? errorMsg(err) : errorMsg
    );
    throw err;
  }
}

// Main toast object with helpers
const toast = Object.assign(createToast, {
  success,
  error,
  info,
  warning,
  loading,
  promise,
});

function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  };
}

export { useToast, toast };