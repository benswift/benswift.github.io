CONTENT_FILE=ccc-assessment-task.md
OUTPUT_FILES=$(CONTENT_FILE:.md=.pdf) $(CONTENT_FILE:.md=.docx)
LATEX_TEMPLATE_FILE=pandoc-template.tex

all: $(OUTPUT_FILES)

%.pdf: %.md $(LATEX_TEMPLATE_FILE)
	pandoc $< --template $(LATEX_TEMPLATE_FILE) -o $@

%.docx: %.md
	pandoc $< -o $@

.PHONY: clean
clean:
	rm $(OUTPUT_FILES)
