// Compiled by ClojureScript 1.10.516 {:static-fns true, :optimize-constants true}
goog.provide('reimagine_logo.dom_helpers');
goog.require('cljs.core');
goog.require('cljs.core.constants');
goog.require('clojure.string');
goog.require('goog.dom');
/**
 * Return the element with the passed id.
 */
reimagine_logo.dom_helpers.get_element = (function reimagine_logo$dom_helpers$get_element(id){
var G__3690 = cljs.core.name(id);
return goog.dom.getElement(G__3690);
});
/**
 * Append all children to parent.
 */
reimagine_logo.dom_helpers.append = (function reimagine_logo$dom_helpers$append(var_args){
var args__4736__auto__ = [];
var len__4730__auto___3697 = arguments.length;
var i__4731__auto___3698 = (0);
while(true){
if((i__4731__auto___3698 < len__4730__auto___3697)){
args__4736__auto__.push((arguments[i__4731__auto___3698]));

var G__3699 = (i__4731__auto___3698 + (1));
i__4731__auto___3698 = G__3699;
continue;
} else {
}
break;
}

var argseq__4737__auto__ = ((((1) < args__4736__auto__.length))?(new cljs.core.IndexedSeq(args__4736__auto__.slice((1)),(0),null)):null);
return reimagine_logo.dom_helpers.append.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),argseq__4737__auto__);
});

reimagine_logo.dom_helpers.append.cljs$core$IFn$_invoke$arity$variadic = (function (parent,children){
var seq__3693_3700 = cljs.core.seq(children);
var chunk__3694_3701 = null;
var count__3695_3702 = (0);
var i__3696_3703 = (0);
while(true){
if((i__3696_3703 < count__3695_3702)){
var child_3704 = chunk__3694_3701.cljs$core$IIndexed$_nth$arity$2(null,i__3696_3703);
goog.dom.appendChild(parent,child_3704);


var G__3705 = seq__3693_3700;
var G__3706 = chunk__3694_3701;
var G__3707 = count__3695_3702;
var G__3708 = (i__3696_3703 + (1));
seq__3693_3700 = G__3705;
chunk__3694_3701 = G__3706;
count__3695_3702 = G__3707;
i__3696_3703 = G__3708;
continue;
} else {
var temp__5720__auto___3709 = cljs.core.seq(seq__3693_3700);
if(temp__5720__auto___3709){
var seq__3693_3710__$1 = temp__5720__auto___3709;
if(cljs.core.chunked_seq_QMARK_(seq__3693_3710__$1)){
var c__4550__auto___3711 = cljs.core.chunk_first(seq__3693_3710__$1);
var G__3712 = cljs.core.chunk_rest(seq__3693_3710__$1);
var G__3713 = c__4550__auto___3711;
var G__3714 = cljs.core.count(c__4550__auto___3711);
var G__3715 = (0);
seq__3693_3700 = G__3712;
chunk__3694_3701 = G__3713;
count__3695_3702 = G__3714;
i__3696_3703 = G__3715;
continue;
} else {
var child_3716 = cljs.core.first(seq__3693_3710__$1);
goog.dom.appendChild(parent,child_3716);


var G__3717 = cljs.core.next(seq__3693_3710__$1);
var G__3718 = null;
var G__3719 = (0);
var G__3720 = (0);
seq__3693_3700 = G__3717;
chunk__3694_3701 = G__3718;
count__3695_3702 = G__3719;
i__3696_3703 = G__3720;
continue;
}
} else {
}
}
break;
}

return parent;
});

reimagine_logo.dom_helpers.append.cljs$lang$maxFixedArity = (1);

/** @this {Function} */
reimagine_logo.dom_helpers.append.cljs$lang$applyTo = (function (seq3691){
var G__3692 = cljs.core.first(seq3691);
var seq3691__$1 = cljs.core.next(seq3691);
var self__4717__auto__ = this;
return self__4717__auto__.cljs$core$IFn$_invoke$arity$variadic(G__3692,seq3691__$1);
});

/**
 * Set the text content for the passed element returning the
 *   element. If a keyword is passed in the place of e, the element with
 *   that id will be used and returned.
 */
reimagine_logo.dom_helpers.set_text = (function reimagine_logo$dom_helpers$set_text(e,s){
var e__$1 = (((e instanceof cljs.core.Keyword))?reimagine_logo.dom_helpers.get_element(e):e);
var G__3721 = e__$1;
goog.dom.setTextContent(G__3721,s);

return G__3721;
});
reimagine_logo.dom_helpers.normalize_args = (function reimagine_logo$dom_helpers$normalize_args(tag,args){
var parts = clojure.string.split.cljs$core$IFn$_invoke$arity$2(cljs.core.name(tag),/(\.|#)/);
var vec__3723 = new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.first(parts),cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,cljs.core.map.cljs$core$IFn$_invoke$arity$2(((function (parts){
return (function (p1__3722_SHARP_){
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(p1__3722_SHARP_,".")){
return cljs.core.cst$kw$class;
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(p1__3722_SHARP_,"#")){
return cljs.core.cst$kw$id;
} else {
return p1__3722_SHARP_;

}
}
});})(parts))
,cljs.core.rest(parts)))], null);
var tag__$1 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__3723,(0),null);
var attrs = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__3723,(1),null);
if(cljs.core.map_QMARK_(cljs.core.first(args))){
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [tag__$1,cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([attrs,cljs.core.first(args)], 0)),cljs.core.rest(args)], null);
} else {
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [tag__$1,attrs,args], null);
}
});
/**
 * Create a dom element using a keyword for the element name and a map
 *   for the attributes. Append all children to parent. If the first
 *   child is a string then the string will be set as the text content of
 *   the parent and all remaining children will be appended.
 */
reimagine_logo.dom_helpers.element = (function reimagine_logo$dom_helpers$element(var_args){
var args__4736__auto__ = [];
var len__4730__auto___3744 = arguments.length;
var i__4731__auto___3745 = (0);
while(true){
if((i__4731__auto___3745 < len__4730__auto___3744)){
args__4736__auto__.push((arguments[i__4731__auto___3745]));

var G__3746 = (i__4731__auto___3745 + (1));
i__4731__auto___3745 = G__3746;
continue;
} else {
}
break;
}

var argseq__4737__auto__ = ((((1) < args__4736__auto__.length))?(new cljs.core.IndexedSeq(args__4736__auto__.slice((1)),(0),null)):null);
return reimagine_logo.dom_helpers.element.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),argseq__4737__auto__);
});

reimagine_logo.dom_helpers.element.cljs$core$IFn$_invoke$arity$variadic = (function (tag,args){
var vec__3730 = reimagine_logo.dom_helpers.normalize_args(tag,args);
var tag__$1 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__3730,(0),null);
var attrs = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__3730,(1),null);
var children = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__3730,(2),null);
var parent = (function (){var G__3736 = cljs.core.name(tag__$1);
var G__3737 = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(((function (G__3736,vec__3730,tag__$1,attrs,children){
return (function (o,p__3738){
var vec__3739 = p__3738;
var k = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__3739,(0),null);
var v = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__3739,(1),null);
return (o[k] = v);
});})(G__3736,vec__3730,tag__$1,attrs,children))
,({}),cljs.core.map.cljs$core$IFn$_invoke$arity$3(((function (G__3736,vec__3730,tag__$1,attrs,children){
return (function (p1__3726_SHARP_,p2__3727_SHARP_){
return (new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[cljs.core.name(p1__3726_SHARP_),p2__3727_SHARP_],null));
});})(G__3736,vec__3730,tag__$1,attrs,children))
,cljs.core.keys(attrs),cljs.core.vals(attrs)));
return goog.dom.createDom(G__3736,G__3737);
})();
var vec__3733 = ((typeof cljs.core.first(children) === 'string')?new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [reimagine_logo.dom_helpers.set_text(reimagine_logo.dom_helpers.element.cljs$core$IFn$_invoke$arity$variadic(tag__$1,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([attrs], 0)),cljs.core.first(children)),cljs.core.rest(children)], null):new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [parent,children], null));
var parent__$1 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__3733,(0),null);
var children__$1 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__3733,(1),null);
return cljs.core.apply.cljs$core$IFn$_invoke$arity$3(reimagine_logo.dom_helpers.append,parent__$1,children__$1);
});

reimagine_logo.dom_helpers.element.cljs$lang$maxFixedArity = (1);

/** @this {Function} */
reimagine_logo.dom_helpers.element.cljs$lang$applyTo = (function (seq3728){
var G__3729 = cljs.core.first(seq3728);
var seq3728__$1 = cljs.core.next(seq3728);
var self__4717__auto__ = this;
return self__4717__auto__.cljs$core$IFn$_invoke$arity$variadic(G__3729,seq3728__$1);
});

/**
 * Remove all children from the element with the passed id.
 */
reimagine_logo.dom_helpers.remove_children = (function reimagine_logo$dom_helpers$remove_children(id){
var parent = (function (){var G__3747 = cljs.core.name(id);
return goog.dom.getElement(G__3747);
})();
return goog.dom.removeChildren(parent);
});
/**
 * Create a dom element from an html string.
 */
reimagine_logo.dom_helpers.html = (function reimagine_logo$dom_helpers$html(s){
return goog.dom.htmlToDocumentFragment(s);
});
reimagine_logo.dom_helpers.element_arg_QMARK_ = (function reimagine_logo$dom_helpers$element_arg_QMARK_(x){
return (((x instanceof cljs.core.Keyword)) || (cljs.core.map_QMARK_(x)) || (typeof x === 'string'));
});
/**
 * Build up a dom element from nested vectors.
 */
reimagine_logo.dom_helpers.build = (function reimagine_logo$dom_helpers$build(x){
if(cljs.core.vector_QMARK_(x)){
var vec__3748 = (((cljs.core.first(x) instanceof cljs.core.Keyword))?new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.apply.cljs$core$IFn$_invoke$arity$2(reimagine_logo.dom_helpers.element,cljs.core.take_while.cljs$core$IFn$_invoke$arity$2(reimagine_logo.dom_helpers.element_arg_QMARK_,x)),cljs.core.drop_while.cljs$core$IFn$_invoke$arity$2(reimagine_logo.dom_helpers.element_arg_QMARK_,x)], null):new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.first(x),cljs.core.rest(x)], null));
var parent = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__3748,(0),null);
var children = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__3748,(1),null);
var children__$1 = cljs.core.map.cljs$core$IFn$_invoke$arity$2(reimagine_logo.dom_helpers.build,children);
return cljs.core.apply.cljs$core$IFn$_invoke$arity$3(reimagine_logo.dom_helpers.append,parent,children__$1);
} else {
return x;
}
});
/**
 * Insert a child element at a specific location.
 */
reimagine_logo.dom_helpers.insert_at = (function reimagine_logo$dom_helpers$insert_at(parent,child,index){
return goog.dom.insertChildAt(parent,child,index);
});
