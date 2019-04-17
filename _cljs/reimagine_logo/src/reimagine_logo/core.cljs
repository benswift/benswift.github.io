(ns reimagine-logo.core
  (:require [reagent.core :as r]
            [goog.string :as gstring]
            [goog.string.format]
            [goog.dom.fullscreen :refer [requestFullScreen]]))

(defonce fps 60)

(def letters
  (r/atom (map #(assoc {:rd 0 :wd 0} :letter %)
               "REIMAGINE")))

(defn update-letter [letter-data]
  (-> letter-data
      (assoc :rd (rand 30))
      (assoc :wd (+ 100 (rand 800)))))

(defn letter-component [{:keys [letter rd wd]}]
  (let [rot (r/atom 0)
        weight (r/atom 400)
        ms-per-frame (/ 1000 fps)]
    (fn []
      (js/setTimeout #(swap! rot + (/ rd fps)) ms-per-frame)
      ^{:key letter}
      [:div.letter
       {:style
        {:transform (gstring/format "rotate(%.4frad)" @rot)
         :font-weight weight}}
       letter])))

(defn logo-component []
  (into
   [:div {:id "logo"}]
   (map letter-component @letters)))

(defn toggle-fullscreen []
  (requestFullScreen (js/document.getElementById "backdrop")))

(defn mount []
  (r/render [logo-component]
            (js/document.getElementById "logo-container")))

(defn main []
  (mount)
  (js/setInterval
   (fn [] (swap! letters #(map update-letter %)))
   10000)
  (js/document.addEventListener "keydown"
                                #(when (= (.-code %) "KeyF")
                                   (toggle-fullscreen))))

(main)
