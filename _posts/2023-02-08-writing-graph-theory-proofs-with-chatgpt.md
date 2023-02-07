---
title: Writing graph theory proofs with ChatGPT
tags: ai teaching
---

Posting logs of [ChatGPT](https://chat.openai.com) interaction is getting a bit
passé by now in Feb '23, so I'll stop doing it soon (I promise). But yesterday I
was hanging out with my father-in-law and showing how it might impact his
classes---he's Associate Chair of the Mathematics Department at a top uni in
China.

The prompts were his (with a bit of light suggesting from me), responses from
ChatGPT.

**Write a proof of of Pythagoras's theorem.**

Pythagoras's theorem states that in a right triangle, the square of the length
of the hypotenuse (the side opposite the right angle) is equal to the sum of the
squares of the lengths of the other two sides. Symbolically, this can be written
as:

c^2 = a^2 + b^2

where c is the length of the hypotenuse, and a and b are the lengths of the
other two sides.

Proof:

Draw a right triangle ABC with sides AB (a), BC (b), and AC (c).

Draw squares with sides AB, BC, and AC on each side of the triangle, as shown
below:

[Diagram of a right triangle with squares on each side]

The area of each of the squares is equal to the square of the length of its
side. Hence:

a^2 = AB x AB = area of square with side AB

b^2 = BC x BC = area of square with side BC

c^2 = AC x AC = area of square with side AC

Consider the combined area of the squares on the two smaller sides (a and b). It
can also be obtained by covering the entire triangle with a larger square and
then subtracting the area of the square on the hypotenuse (c). Hence:

a^2 + b^2 = (AB + BC) x (AB + BC) - AC x AC

On the right-hand side of the equation, (AB + BC) is equal to the length of the
hypotenuse (c**, since it is the longest side in a right triangle. Hence:

a^2 + b^2 = c x c - c x c

Simplifying the right-hand side of the equation, we obtain:

a^2 + b^2 = c x c

Hence, we have proved that:

c^2 = a^2 + b^2

This is Pythagoras's theorem.

**Ok, that's great. Now it's time for some graph theory. Can you give me a proof
of the 5-color theorem?**

The five color theorem states that any planar graph (a graph that can be drawn
on a plane without any of its edges crossing) can be colored with no more than
five colors, such that no two adjacent vertices (vertices connected by an edge)
have the same color.

Proof:

Consider a planar graph G with a minimum number of vertices, and suppose that it
cannot be colored with fewer than five colors.

Since G has a minimum number of vertices, there must be a vertex v in G with the
smallest degree (the number of edges incident to v). Let d be the degree of v.

Since G cannot be colored with fewer than five colors, d must be greater than or
equal to 4.

Consider the set of vertices adjacent to v, and let S be the set of colors that
have been used to color these vertices.

Since the degree of v is greater than or equal to 4, the number of colors in S
is greater than or equal to 4.

Suppose, S contains all five colors. Then, since each color can be assigned to
at most one of the vertices adjacent to v, we have a contradiction, as there are
more vertices than colors.

Hence, there must be a color not in S. Call this color c.

Color vertex v with color c. Since no two adjacent vertices have the same color,
it follows that G can be colored with no more than five colors.

This proves the five color theorem: any planar graph can be colored with no more
than five colors, such that no two adjacent vertices have the same color.

**Ok, can you prove the 4-color theorem as well?**

The four color theorem states that any planar graph can be colored with no more
than four colors, such that no two adjacent vertices have the same color.

Proof:

Consider a planar graph G and let H be a subgraph of G.

We proceed by induction on the number of vertices of H. If H has only one
vertex, it can be colored with a single color.

Suppose that the statement is true for all subgraphs of G with at most n - 1
vertices, where n is a positive integer.

Let H be a subgraph of G with n vertices, and let v be a vertex in H with the
minimum degree.

By the induction hypothesis, all subgraphs of H with fewer than n vertices can
be colored with at most four colors.

Consider the set of vertices adjacent to v in H, and let S be the set of colors
used to color these vertices.

If |S| < 4, then we can color vertex v with a color not in S, and H can be
colored with at most four colors.

Otherwise, |S| = 4. We can color v with any color not in S, and since all
subgraphs of H with fewer than n vertices can be colored with at most four
colors, it follows that H can be colored with at most four colors.

Hence, the statement is true for all subgraphs of G with at most n vertices.

Since the statement is true for all positive integers n, it follows that any
planar graph can be colored with no more than four colors, such that no two
adjacent vertices have the same color.

This proves the four color theorem: any planar graph can be colored with no more
than four colors, such that no two adjacent vertices have the same color.

## His response?

Shock, really. The proof of the [five colour
theorem](https://en.wikipedia.org/wiki/Five_color_theorem) is an assignment he
might set in one of his early-year undergraduate classes, and the proof given
certainly looks ok. It might well be wrong (he didn't look at it in detail) but
it's the sort of thing a harried marker would assume was written by a student
who had some idea of what was going on in class. The [four colour
theorem](https://en.wikipedia.org/wiki/Four_color_theorem) is a much trickier
proof---it was an unsolved research problem until 2005. The proof for that one
is almost certainly wrong, but that would only be obvious to someone with
considerable expertise in the domain (graph theory). Such is the way of LLMs.

What does it all mean? I dunno. It's gonna be a wild decade.
