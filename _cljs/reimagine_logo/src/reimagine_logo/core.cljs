(ns reimagine-logo.core
  (:require [clojure.string :as string]
            [reimagine-logo.dom-helpers :as dom]))

(defn mount-logo []
  (->> "REIMAGINE"
       (map
        (fn [c]
          (dom/element :div {:style (if (= c "A") "letter-A" "letter")} c)))
       (apply dom/append (dom/get-element :logo))))

(mount-logo)
