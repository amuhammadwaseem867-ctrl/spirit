"use client";

import { useState } from "react";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";

import styles from "./ProductFilters.module.css";

const DEFAULT_FILTERS = {
  category: "ALL",
  gender: "ALL",
  size: "ALL",
  sort: "FEATURED",
};

const CATEGORY_OPTIONS = [
  "ALL",
  "PERFORMANCE",
  "TRAINING",
  "ESSENTIALS",
];

const GENDER_OPTIONS = [
  "ALL",
  "WOMEN",
  "MEN",
];

const SIZE_OPTIONS = [
  "ALL",
  "XS",
  "S",
  "M",
  "L",
  "XL",
];

const SORT_OPTIONS = [
  "FEATURED",
  "NEWEST",
  "A — Z",
  "Z — A",
];

export default function ProductFilters({
  filters = DEFAULT_FILTERS,
  onChange,
  resultCount,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openPanel, setOpenPanel] = useState(null);

  const currentFilters = {
    ...DEFAULT_FILTERS,
    ...filters,
  };

  const toggleMobileFilters = () => {
    if (mobileOpen) {
      setOpenPanel(null);
    }

    setMobileOpen(!mobileOpen);
  };

  const updateFilter = (key, value) => {
    onChange?.({
      ...currentFilters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onChange?.({
      ...DEFAULT_FILTERS,
    });
  };

  const activeFilterCount = Object.entries(
    currentFilters
  ).filter(
    ([key, value]) =>
      key !== "sort" && value !== "ALL"
  ).length;

  const renderOptions = (
    key,
    options,
    mobile = false
  ) => {
    const isOpen = openPanel === key;

    if (mobile) {
      return (
        <div className={styles.mobileFilterGroup}>
          <button
            type="button"
            className={styles.mobileFilterTrigger}
            onClick={() =>
              setOpenPanel(isOpen ? null : key)
            }
            aria-expanded={isOpen}
          >
            <span>
              {key === "category"
                ? "CATEGORY"
                : key === "gender"
                ? "GENDER"
                : "SIZE"}
            </span>

            <ChevronDown
              size={15}
              strokeWidth={1}
              className={
                isOpen
                  ? styles.chevronOpen
                  : ""
              }
            />
          </button>

          <div
            className={`${styles.mobileOptions} ${
              isOpen
                ? styles.mobileOptionsOpen
                : ""
            }`}
          >
            {options.map((option) => (
              <button
                key={option}
                type="button"
                className={
                  currentFilters[key] === option
                    ? styles.optionActive
                    : ""
                }
                onClick={() => {
                  updateFilter(key, option);
                  setOpenPanel(null);
                }}
              >
                <span>{option}</span>

                {currentFilters[key] === option && (
                  <span className={styles.optionMark}>
                    ×
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className={styles.desktopGroup}>
        <span className={styles.groupLabel}>
          {key === "category"
            ? "CATEGORY"
            : key === "gender"
            ? "GENDER"
            : "SIZE"}
        </span>

        <div className={styles.options}>
          {options.map((option) => (
            <button
              key={option}
              type="button"
              className={
                currentFilters[key] === option
                  ? styles.optionActive
                  : ""
              }
              onClick={() =>
                updateFilter(key, option)
              }
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section className={styles.filters}>
      <div className={styles.desktopFilters}>
        <div className={styles.filterIntro}>
          <SlidersHorizontal
            size={14}
            strokeWidth={1.1}
          />

          <span>FILTER</span>

          {activeFilterCount > 0 && (
            <span className={styles.count}>
              {activeFilterCount}
            </span>
          )}
        </div>

        {renderOptions(
          "category",
          CATEGORY_OPTIONS
        )}

        {renderOptions(
          "gender",
          GENDER_OPTIONS
        )}

        {renderOptions("size", SIZE_OPTIONS)}

        <div className={styles.sortGroup}>
          <span className={styles.groupLabel}>
            SORT
          </span>

          <select
            value={currentFilters.sort}
            onChange={(event) =>
              updateFilter(
                "sort",
                event.target.value
              )
            }
            aria-label="Sort products"
          >
            {SORT_OPTIONS.map((option) => (
              <option
                key={option}
                value={option}
              >
                {option}
              </option>
            ))}
          </select>

          <ChevronDown
            size={13}
            strokeWidth={1}
          />
        </div>

        <div className={styles.filterEnd}>
          {typeof resultCount === "number" && (
            <span className={styles.resultCount}>
              {resultCount}{" "}
              {resultCount === 1
                ? "PRODUCT"
                : "PRODUCTS"}
            </span>
          )}

          {activeFilterCount > 0 && (
            <button
              type="button"
              className={styles.clearButton}
              onClick={clearFilters}
            >
              CLEAR ALL
              <X
                size={12}
                strokeWidth={1.1}
              />
            </button>
          )}
        </div>
      </div>

      <div className={styles.mobileFilters}>
        <button
          type="button"
          className={styles.mobileMainTrigger}
          onClick={toggleMobileFilters}
          aria-expanded={mobileOpen}
        >
          <span className={styles.mobileMainLabel}>
            <SlidersHorizontal
              size={14}
              strokeWidth={1.1}
            />

            FILTER
          </span>

          {activeFilterCount > 0 && (
            <span className={styles.count}>
              {activeFilterCount}
            </span>
          )}

          <ChevronDown
            size={15}
            strokeWidth={1}
            className={
              mobileOpen
                ? styles.chevronOpen
                : ""
            }
          />
        </button>

        {typeof resultCount === "number" && (
          <span className={styles.mobileResult}>
            {resultCount} PRODUCTS
          </span>
        )}

        {mobileOpen && (
          <div className={styles.mobilePanel}>
            {renderOptions(
              "category",
              CATEGORY_OPTIONS,
              true
            )}

            {renderOptions(
              "gender",
              GENDER_OPTIONS,
              true
            )}

            {renderOptions(
              "size",
              SIZE_OPTIONS,
              true
            )}

            <div className={styles.mobileSort}>
              <span>SORT</span>

              <select
                value={currentFilters.sort}
                onChange={(event) =>
                  updateFilter(
                    "sort",
                    event.target.value
                  )
                }
              >
                {SORT_OPTIONS.map((option) => (
                  <option
                    key={option}
                    value={option}
                  >
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {activeFilterCount > 0 && (
              <button
                type="button"
                className={styles.mobileClear}
                onClick={clearFilters}
              >
                CLEAR ALL
                <X
                  size={13}
                  strokeWidth={1.1}
                />
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}