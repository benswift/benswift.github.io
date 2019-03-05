(ns reimagine-logo.core
  (:require [reagent.core :as r]))

(defn random-classes []
  (->> ["big" "small" "heavy" "light" "cw90" "cc90" "cw180" "cc180" "cw270" "cc270"]
       shuffle
       (take (rand-int 3))))

(defn letter-component [letter]
  ^{:key letter}
  [:div
   {:class (into ["letter" (when (= letter "A") "letter-A")]
                 (random-classes))}
   letter])

(defn logo-component []
  (into
   [:div {:id "logo"}]
   (map letter-component "REIMAGINE")))

(defn mount []
  (r/render [logo-component]
            (js/document.getElementById "logo-container")))

(mount)

(js/setInterval #(mount) 10000)
