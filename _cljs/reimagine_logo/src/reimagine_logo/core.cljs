(ns reimagine-logo.core
  (:require [reimagine-logo.tween :refer [ease-in-out transition-elastic]]
            [reagent.core :as r]
            [goog.string :as gstring]
            [goog.string.format]
            [goog.dom.fullscreen :refer [requestFullScreen]]))

(defonce fps 60)

(defn rand-attribute-val [attribute]
  (let [[min max]
        (case attribute
          :angle [-3600 3600]
          :size [5 25]
          :weight [100 900])]
    (+ min (rand (- max min)))))

(defn easing-fn [{:keys [step initial final num-steps]}]
  (->> (/ step num-steps)
       (ease-in-out transition-elastic)
       (* (- final initial))
       (+ initial)))

(defn initial-animation-state []
  (into {:step 0}
        (map (juxt identity (fn [attr]
                              {:initial (rand-attribute-val attr)
                               :final (rand-attribute-val attr)
                               :num-steps (rand-int (* fps 10))}))
             [:angle :size :weight])))

(defn new-animation-state [state]
  (into {:step 0}
        (map (juxt identity (fn [attr]
                              {:initial (easing-fn state)
                               :final (rand-attribute-val attr)
                               :num-steps (rand-int (* fps 10))}))
             [:angle :size :weight])))

(defn value->css [attribute value]
  (case attribute
    :angle {:transform (gstring/format "rotate(%.2fdeg)" value)}
    :size {:font-size (gstring/format "%.2fvmin" value)}
    :weight {:font-weight value}))

(defn letter-component [letter]
  (let [animation-state (r/atom (initial-animation-state))]
    (fn []
      (js/setTimeout (fn [] (swap! animation-state update :step inc)) (/ 1000 fps))
      ^{:key letter}
      [:div.letter
       {:style
        (into {} (map (fn [[attr anim-params]] (value->css attr (easing-fn anim-params))) (dissoc @animation-state :step)))}
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
