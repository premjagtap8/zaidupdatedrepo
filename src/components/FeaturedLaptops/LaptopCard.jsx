import React from "react";
import { Star, ShoppingCart } from "lucide-react";

const formatINR = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

const LaptopCard = ({ product, onImageError, onAddToCart }) => {
  const price = Number(product?.price) || 0;
  const mrp = Number(product?.originalPrice) || 0;
  const rating = Number(product?.rating) || 0;

  // Prefer the discount computed by the parent; otherwise work it out here.
  // (The old code produced NaN / Infinity when originalPrice was 0.)
  const discount =
    Number(product?.discount) ||
    (mrp > price && price > 0 ? Math.round(((mrp - price) / mrp) * 100) : 0);

  // The top-left badge already says "X% OFF" for discounted items,
  // so don't repeat it next to the price.
  const badgeShowsDiscount = String(product?.badge || "").includes("% OFF");
  const showInlineDiscount = discount > 0 && !badgeShowsDiscount;

  const hasHoverImage =
    product?.hoverImage && product.hoverImage !== product.primaryImage;

  return (
    <div
      className="
        group relative flex h-full w-full flex-col justify-between
        rounded-xl border border-gray-100 bg-white p-3 shadow-sm
        transition-shadow duration-300
        sm:p-4
        dark:border-slate-800 dark:bg-slate-900
        [@media(hover:hover)]:hover:shadow-md
        focus-within:ring-2 focus-within:ring-[#008a45]/30
      "
    >
      {/* Top section: badge, image, titles */}
      <div className="min-w-0">
        {product?.badge && (
          <div className="absolute left-3 top-3 z-10">
            <span
              className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white ${
                product.badgeBg || "bg-emerald-600"
              }`}
            >
              {product.badge}
            </span>
          </div>
        )}

        {/* Image: aspect-ratio instead of a fixed 192px height, so it scales
            with the card on every screen size */}
        <div className="relative mb-3 flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-lg bg-gray-50/50 sm:mb-4 dark:bg-slate-800/40">
          <img
            src={product?.primaryImage}
            alt={product?.title || "Laptop"}
            loading="lazy"
            decoding="async"
            onError={onImageError}
            className={`
              absolute inset-0 h-full w-full object-contain
              transition-opacity duration-500 ease-in-out
              ${
                hasHoverImage
                  ? "[@media(hover:hover)]:group-hover:opacity-0"
                  : ""
              }
            `}
          />

          {/* Hover image only on devices that can hover (not touch), and only
              when a different second image exists */}
          {hasHoverImage && (
            <img
              src={product.hoverImage}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              onError={onImageError}
              className="
                absolute inset-0 h-full w-full object-contain opacity-0
                transition duration-500 ease-in-out
                [@media(hover:hover)]:group-hover:scale-105
                [@media(hover:hover)]:group-hover:opacity-100
              "
            />
          )}
        </div>

        {/* Fixed min-heights keep every card in the row the same height */}
        <h3 className="line-clamp-2 min-h-[2.5em] text-sm font-bold leading-tight text-gray-900 dark:text-white">
          {product?.title}
        </h3>
        <p className="mb-3 mt-1 line-clamp-2 min-h-[2.5em] text-xs text-gray-500 dark:text-slate-400">
          {product?.subtitle}
        </p>
      </div>

      {/* Bottom section: prices, rating, cart button */}
      <div className="mt-2 flex items-end justify-between gap-3 border-t border-gray-50 pt-2 dark:border-slate-800">
        {/* min-w-0 + flex-wrap: the price row wraps instead of pushing the
            cart button off the card on narrow phones */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="text-base font-extrabold text-gray-900 dark:text-white">
              {formatINR(price)}
            </span>

            {mrp > price && (
              <span className="text-xs font-medium text-gray-400 line-through dark:text-slate-500">
                {formatINR(mrp)}
              </span>
            )}

            {showInlineDiscount && (
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                {discount}% OFF
              </span>
            )}
          </div>

          {rating > 0 && (
            <div className="mt-1 flex items-center gap-1">
              <div
                className="flex"
                role="img"
                aria-label={`Rated ${rating.toFixed(1)} out of 5`}
              >
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star
                    key={i}
                    aria-hidden="true"
                    className={`h-3.5 w-3.5 ${
                      i < Math.round(rating)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-transparent text-gray-300 dark:text-slate-600"
                    }`}
                  />
                ))}
              </div>
              <span className="ml-1 text-xs font-semibold text-gray-600 dark:text-slate-300">
                {rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* 44px touch target */}
        <button
          type="button"
          aria-label={`Add ${product?.title || "laptop"} to cart`}
          onClick={() => onAddToCart?.(product)}
          className="
            flex h-11 w-11 shrink-0 items-center justify-center rounded-lg
            bg-[#008a45] text-white shadow-sm transition
            duration-200 hover:bg-[#007038] active:scale-95
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-[#008a45] focus-visible:ring-offset-2
            dark:bg-emerald-600 dark:hover:bg-emerald-700
            dark:focus-visible:ring-offset-slate-900
          "
        >
          <ShoppingCart className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default LaptopCard;
