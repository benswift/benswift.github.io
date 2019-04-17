(ns reimagine-logo.core
  (:require [reimagine-logo.tween :as tween]
            [reagent.core :as r]
            [goog.string :as gstring]
            [goog.string.format]
            [goog.dom.fullscreen :refer [requestFullScreen]]))

(defn letter-component [{:keys [letter ad sd wd]}]
  (let [angle (r/atom (if (= letter "A") -90 0)) ;; deg
        size (r/atom 10) ;; vmin
        weight (r/atom 200)]
    (fn [{:keys [letter ad sd wd]}]
      (js/setTimeout
       (fn []
         (swap! angle + ad)
         (when (< 3 @size 25) (swap! size + sd))
         (when (< 100 @weight 900) (swap! weight + wd)))
       (/ 1000 60)) ;; 60fps
      ^{:key letter}
      [:div.letter
       {:style
        {:transform (gstring/format "rotate(%.2fdeg)" @angle)
         :font-size (gstring/format "%.2fvmin" @size)
         :font-weight @weight}}
       letter])))

(defn new-delta [attribute]
  (if (< (rand 10) 7)
    ;; most of the time, set the delta to zero so it won't change
    0
    ;; otherwise update the per-frame delta
    (case attribute
      :ad (- 1 (rand 2))
      :sd (- 0.01 (rand 0.02))
      :wd (- 1 (rand 2)))))

(defn logo-component []
  (let [letters
        (r/atom (map #(assoc {:ad 0 :sd 0 :wd 0} :letter %)
                     "REIMAGINE"))

        update-letter
        (fn [letter-data]
          (-> letter-data
              (assoc :ad (new-delta :ad))
              (assoc :sd (new-delta :sd))
              (assoc :wd (new-delta :wd))))]
    (fn []
      (js/setTimeout
       (fn []
         (swap! letters #(map update-letter %)))
       10000) ;; change spinnies every 10s
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
