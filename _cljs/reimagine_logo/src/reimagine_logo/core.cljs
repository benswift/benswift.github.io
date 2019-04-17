(ns reimagine-logo.core
  (:require [reagent.core :as r]
            [goog.string :as gstring]
            [goog.string.format]
            [goog.dom.fullscreen :refer [requestFullScreen]]))

(defn letter-component [{:keys [letter rd wd]}]
  (let [rot (r/atom 0)
        weight (r/atom 300)
        update-atoms (fn []
                       (swap! rot + rd)
                       (when (< 100 @weight 900)
                         (swap! weight + wd)))]
    (fn []
      (js/setTimeout update-atoms (/ 1000 60)) ;; 60fps
      ^{:key letter}
      [:div.letter
       {:style
        {:transform (gstring/format "rotate(%.4frad)" @rot)
         :font-weight @weight}}
       letter])))

(defn logo-component []
  (let [letters
        (r/atom (map #(assoc {:rd 0 :wd 0} :letter %)
                     "REIMAGINE"))

        update-letter
        (fn [letter-data]
          (-> letter-data
              (assoc :rd (- 0.1 (rand 0.1)))
              (assoc :wd (- 0.1 (rand 0.1)))))]
    (fn []
      (js/setTimeout
       (fn []
         (swap! letters #(map update-letter %)))
       1000) ;; change spinnies every 10s
      (into
       [:div {:id "logo"}]
       (for [letter-data @letters]
         [letter-component letter-data])))))

(defn toggle-fullscreen []
  (requestFullScreen (js/document.getElementById "backdrop")))

(defn mount []
  (r/render [logo-component]
            (js/document.getElementById "logo-container")))

(defn main []
  (mount)
  (js/document.addEventListener "keydown"
                                #(when (= (.-code %) "KeyF")
                                   (toggle-fullscreen))))

(main)
