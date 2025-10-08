export interface ColorClasses {
  bg: {
    solid: string;
    light: string;
    gradient: string;
  };
  text: {
    primary: string;
    secondary: string;
  };
  border: {
    primary: string;
    secondary: string;
  };
}

export function getColorClasses(colorId: string): ColorClasses {
  const colorMap: Record<string, ColorClasses> = {
    slate: {
      bg: {
        solid: 'bg-slate-600',
        light: 'bg-slate-50',
        gradient: 'from-slate-600 to-slate-800',
      },
      text: {
        primary: 'text-slate-600',
        secondary: 'text-slate-100',
      },
      border: {
        primary: 'border-slate-600',
        secondary: 'border-slate-200',
      },
    },
    gray: {
      bg: {
        solid: 'bg-gray-600',
        light: 'bg-gray-50',
        gradient: 'from-gray-600 to-gray-800',
      },
      text: {
        primary: 'text-gray-600',
        secondary: 'text-gray-100',
      },
      border: {
        primary: 'border-gray-600',
        secondary: 'border-gray-200',
      },
    },
    zinc: {
      bg: {
        solid: 'bg-zinc-600',
        light: 'bg-zinc-50',
        gradient: 'from-zinc-600 to-zinc-800',
      },
      text: {
        primary: 'text-zinc-600',
        secondary: 'text-zinc-100',
      },
      border: {
        primary: 'border-zinc-600',
        secondary: 'border-zinc-200',
      },
    },
    neutral: {
      bg: {
        solid: 'bg-neutral-600',
        light: 'bg-neutral-50',
        gradient: 'from-neutral-600 to-neutral-800',
      },
      text: {
        primary: 'text-neutral-600',
        secondary: 'text-neutral-100',
      },
      border: {
        primary: 'border-neutral-600',
        secondary: 'border-neutral-200',
      },
    },
    stone: {
      bg: {
        solid: 'bg-stone-600',
        light: 'bg-stone-50',
        gradient: 'from-stone-600 to-stone-800',
      },
      text: {
        primary: 'text-stone-600',
        secondary: 'text-stone-100',
      },
      border: {
        primary: 'border-stone-600',
        secondary: 'border-stone-200',
      },
    },
    red: {
      bg: {
        solid: 'bg-red-600',
        light: 'bg-red-50',
        gradient: 'from-red-600 to-red-800',
      },
      text: {
        primary: 'text-red-600',
        secondary: 'text-red-100',
      },
      border: {
        primary: 'border-red-600',
        secondary: 'border-red-200',
      },
    },
    orange: {
      bg: {
        solid: 'bg-orange-600',
        light: 'bg-orange-50',
        gradient: 'from-orange-600 to-orange-800',
      },
      text: {
        primary: 'text-orange-600',
        secondary: 'text-orange-100',
      },
      border: {
        primary: 'border-orange-600',
        secondary: 'border-orange-200',
      },
    },
    amber: {
      bg: {
        solid: 'bg-amber-600',
        light: 'bg-amber-50',
        gradient: 'from-amber-600 to-amber-800',
      },
      text: {
        primary: 'text-amber-600',
        secondary: 'text-amber-100',
      },
      border: {
        primary: 'border-amber-600',
        secondary: 'border-amber-200',
      },
    },
    yellow: {
      bg: {
        solid: 'bg-yellow-600',
        light: 'bg-yellow-50',
        gradient: 'from-yellow-600 to-yellow-800',
      },
      text: {
        primary: 'text-yellow-600',
        secondary: 'text-yellow-100',
      },
      border: {
        primary: 'border-yellow-600',
        secondary: 'border-yellow-200',
      },
    },
    lime: {
      bg: {
        solid: 'bg-lime-600',
        light: 'bg-lime-50',
        gradient: 'from-lime-600 to-lime-800',
      },
      text: {
        primary: 'text-lime-600',
        secondary: 'text-lime-100',
      },
      border: {
        primary: 'border-lime-600',
        secondary: 'border-lime-200',
      },
    },
    green: {
      bg: {
        solid: 'bg-green-600',
        light: 'bg-green-50',
        gradient: 'from-green-600 to-green-800',
      },
      text: {
        primary: 'text-green-600',
        secondary: 'text-green-100',
      },
      border: {
        primary: 'border-green-600',
        secondary: 'border-green-200',
      },
    },
    emerald: {
      bg: {
        solid: 'bg-emerald-600',
        light: 'bg-emerald-50',
        gradient: 'from-emerald-600 to-emerald-800',
      },
      text: {
        primary: 'text-emerald-600',
        secondary: 'text-emerald-100',
      },
      border: {
        primary: 'border-emerald-600',
        secondary: 'border-emerald-200',
      },
    },
    teal: {
      bg: {
        solid: 'bg-teal-600',
        light: 'bg-teal-50',
        gradient: 'from-teal-600 to-teal-800',
      },
      text: {
        primary: 'text-teal-600',
        secondary: 'text-teal-100',
      },
      border: {
        primary: 'border-teal-600',
        secondary: 'border-teal-200',
      },
    },
    cyan: {
      bg: {
        solid: 'bg-cyan-600',
        light: 'bg-cyan-50',
        gradient: 'from-cyan-600 to-cyan-800',
      },
      text: {
        primary: 'text-cyan-600',
        secondary: 'text-cyan-100',
      },
      border: {
        primary: 'border-cyan-600',
        secondary: 'border-cyan-200',
      },
    },
    sky: {
      bg: {
        solid: 'bg-sky-600',
        light: 'bg-sky-50',
        gradient: 'from-sky-600 to-sky-800',
      },
      text: {
        primary: 'text-sky-600',
        secondary: 'text-sky-100',
      },
      border: {
        primary: 'border-sky-600',
        secondary: 'border-sky-200',
      },
    },
    blue: {
      bg: {
        solid: 'bg-blue-600',
        light: 'bg-blue-50',
        gradient: 'from-blue-600 to-blue-800',
      },
      text: {
        primary: 'text-blue-600',
        secondary: 'text-blue-100',
      },
      border: {
        primary: 'border-blue-600',
        secondary: 'border-blue-200',
      },
    },
    violet: {
      bg: {
        solid: 'bg-violet-600',
        light: 'bg-violet-50',
        gradient: 'from-violet-600 to-violet-800',
      },
      text: {
        primary: 'text-violet-600',
        secondary: 'text-violet-100',
      },
      border: {
        primary: 'border-violet-600',
        secondary: 'border-violet-200',
      },
    },
    purple: {
      bg: {
        solid: 'bg-purple-600',
        light: 'bg-purple-50',
        gradient: 'from-purple-600 to-purple-800',
      },
      text: {
        primary: 'text-purple-600',
        secondary: 'text-purple-100',
      },
      border: {
        primary: 'border-purple-600',
        secondary: 'border-purple-200',
      },
    },
    fuchsia: {
      bg: {
        solid: 'bg-fuchsia-600',
        light: 'bg-fuchsia-50',
        gradient: 'from-fuchsia-600 to-fuchsia-800',
      },
      text: {
        primary: 'text-fuchsia-600',
        secondary: 'text-fuchsia-100',
      },
      border: {
        primary: 'border-fuchsia-600',
        secondary: 'border-fuchsia-200',
      },
    },
    pink: {
      bg: {
        solid: 'bg-pink-600',
        light: 'bg-pink-50',
        gradient: 'from-pink-600 to-pink-800',
      },
      text: {
        primary: 'text-pink-600',
        secondary: 'text-pink-100',
      },
      border: {
        primary: 'border-pink-600',
        secondary: 'border-pink-200',
      },
    },
    rose: {
      bg: {
        solid: 'bg-rose-600',
        light: 'bg-rose-50',
        gradient: 'from-rose-600 to-rose-800',
      },
      text: {
        primary: 'text-rose-600',
        secondary: 'text-rose-100',
      },
      border: {
        primary: 'border-rose-600',
        secondary: 'border-rose-200',
      },
    },
  };

  return colorMap[colorId] || colorMap.slate;
}
