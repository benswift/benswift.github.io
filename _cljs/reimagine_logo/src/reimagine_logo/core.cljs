(ns reimagine-logo.core
  (:require [reagent.core :as r]))

(defn letter-component [letter]
  [:div letter])

(defn mountit []
  (r/render [letter-component "R"]
            (js/document.getElementById "logo")))

(mountit)
