(ns reimagine-logo.core
  (:require [reagent.core :as r]))

(defn letter-component [letter]
  [:div letter])

(defn logo-component []
  [:div {:id "logo"}
   (for [letter "REIMAGINE"]
     ^{:key letter} [:div {:class "letter"} letter])])

(defn mountit []
  (r/render [logo-component]
            (js/document.getElementById "logo-container")))

(mountit)
