(ns reimagine-logo.core
  (:require [reimagine-logo.tween :refer [ease-in-out transition-elastic]]
            [reagent.core :as r]
            [goog.string :as gstring]
            [goog.string.format]
            [goog.dom.fullscreen :refer [requestFullScreen]]))

(defn rand-attribute-val [attribute]
  (let [[min max]
        (case attribute
          :angle [-3600 3600]
          :size [5 25]
          :weight [100 900])])
  (+ min (rand (- max min))))

(defn attribute->style [attribute value]
  (case attribute
    :angle {:transform (gstring/format "rotate(%.2fdeg)" value)}
    :size {:font-size (gstring/format "%.2fvmin" value)}
    :weight {:font-weight value}))

(defn easing-closure [attribute initial]
  (let [final (rand-attribute-val attribute)
        range (- final initial)
        num-steps (rand-int 60)]
    (fn [step]
      (->> (/ step num-steps)
           (ease-in-out transition-elastic)
           (* range)
           (+ initial)))))

(defn letter-component [letter]
  (let [step (r/atom 0)
        style-transition-closures
        (into {} (map (fn [attr] {attr (easing-closure attr (rand-attribute-val attr))}) [:angle :size :weight]))]
    (fn [letter]
      (js/setTimeout #(swap! step inc) (/ 1000 60)) ;; 60fps
      ^{:key letter}
      [:div.letter
       {:style
        (into {} (map (fn [[attr easing-fn]] {attr (attribute->style attr (easing-fn 0))})
                      style-transition-closures))}
       letter])))

(defn logo-component []
  (let [letters "REIMAGINE"]
    (fn []
      (into
       [:div {:id "logo"}]
       (for [letter-data letters]
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
