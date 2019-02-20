(ns reimagine-logo.core
  (:require [clojure.string :as string]
            [reimagine-logo.dom-helpers :as dom]))

(defn mount-logo []
  (->> "reimagine"
       (map #(dom/element :span {:class "ri-letter"} %))
       (apply dom/append (dom/get-element :logo))))

(mount-logo)
