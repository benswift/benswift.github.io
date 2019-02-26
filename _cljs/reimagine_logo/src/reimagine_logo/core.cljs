(ns reimagine-logo.core
  (:require [reagent.core :as r]))

(defn letter-component [letter]
  [:div letter])

(defn random-classes []
  (->> ["big" "small" "heavy" "light" "cw90" "cc90" "cw180" "cc180" "cw270" "cc270"]
      shuffle
      (take (rand-int 3))))

(defn logo-component []
  [:div {:id "logo"}
   (for [letter "REIMAGINE"]
     ^{:key letter} [:div {:class (concat ["letter" (when (= letter "A") "letter-A")] (random-classes))} letter])])

(defn mountit []
  (r/render [logo-component]
            (js/document.getElementById "logo-container")))

(mountit)

