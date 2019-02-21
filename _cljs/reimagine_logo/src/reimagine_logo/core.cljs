(ns reimagine-logo.core
  (:require [reimagine-logo.dom-helpers :as dom]))

(defn mount-logo []
  (->> "REIMAGINE"
       (map #(dom/element :div {:style (if (= % "A") "letter-A" "letter")} %))
       (apply dom/append (dom/get-element :logo))))

(mount-logo)
