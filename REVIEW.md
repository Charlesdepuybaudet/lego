# 🧱 Design Review – LEGO Project

## 📐 Low-Fidelity Sketch

![wireframe](my-sketch.png)

---

## 🧠 Reasoning & Decision-Making

### ✔️ 1. Sketch
I created a low-fidelity hand-drawn sketch to outline the structure of the interface before writing any code.

### ✔️ 2. Design Considerations

1. **Readability and hierarchy**: Deals are clearly separated with consistent formatting—title, price, link—allowing users to scan easily.
2. **Quick access to filters**: Filtering options (discounts, comments, hot deals, favorites) are grouped in a left panel for intuitive access.
3. **User-centric layout**: I aimed to create a layout that supports efficient decision-making, especially for bargain hunters.

---

## ❓ Problem Statement

### What problem are we solving?
Helping users browse, compare, and track the best LEGO deals online (price, popularity, availability) quickly and visually.

### What does success look like?
- Fast access to top LEGO deals.
- Personalized experience via filters and favorites.
- Access to second-hand market data (Vinted) for deeper pricing insight.

We can measure success with:
- Low time-to-decision for the user.
- Frequent use of filters/favorites.
- Clear comprehension of available deals and Vinted stats.

---

## 🎨 Visual Design Choices

1. **Layout**: Two-column structure—filters on the left, main content on the right—to enhance focus and navigation.
2. **Spacing**: Ample space between each deal to reduce visual overload.
3. **Color**: Gold is used to indicate active favorites visually; neutral background lets the content stand out.
4. **Font**: Clean, sans-serif typeface (default system font) improves readability on screen.

---

## 🧭 Interaction Patterns

1. **Clickable filter spans**: Lightweight interaction elements used instead of heavier buttons or checkboxes.
2. **Favorite toggle**: Star icon toggles the deal as favorite using `localStorage`, with immediate visual feedback.
3. **Sorting dropdown**: `<select>` inputs allow sorting by price or date, keeping the interface clean and intuitive.

---

## ✅ Conclusion

This design solves the key problem of exploring LEGO deals effectively. The interface is minimalist, dynamic, and functional. All user actions (sorting, filtering, favoriting) are responsive and intuitive. The added insights from Vinted sales data elevate the user experience for informed purchasing decisions.
