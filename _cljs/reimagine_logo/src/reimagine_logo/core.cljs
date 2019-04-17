(ns reimagine-logo.core
  (:require [reagent.core :as r]
            [goog.string :as gstring]
            [goog.string.format]
            [goog.dom.fullscreen :refer [requestFullScreen]]))

(defonce fps 60)

(def letters
  (r/atom (map #(assoc {:rd 0 :wd 0} :letter %)
               "REIMAGINE")))

(defn update-letter-rates []
  (let [update-letter #(merge % {:rd (- 0.1 (rand 0.1))
                                 :wd (- 0.1 (rand 0.1))})]
    (swap! letters #(map update-letter %))))

(defn letter-component [{:keys [letter rd wd]}]
  (let [rot (r/atom 0)
        weight (r/atom 300)
        ms-per-frame (/ 1000 fps)
        update-atoms (fn []
                       (swap! rot + rd)
                       (when (< 100 @weight 900)
                         (swap! weight + wd)))]
    (fn []
      (js/setTimeout update-atoms ms-per-frame)
      ^{:key letter}
      [:div.letter
       {:style
        {:transform (gstring/format "rotate(%.4frad)" @rot)
         :font-weight @weight}}
       letter])))

(defn logo-component []
  (into
   [:div {:id "logo"}]
   (for [letter-data @letters]
     [letter-component letter-data])))

(defn toggle-fullscreen []
  (requestFullScreen (js/document.getElementById "backdrop")))

(defn mount []
  (r/render [logo-component @letters]
            (js/document.getElementById "logo-container")))

(defn main []
  (mount)
  (js/setInterval update-letter-rates 1000)
  (js/document.addEventListener "keydown"
                                #(when (= (.-code %) "KeyF")
                                   (toggle-fullscreen))))

(main)
