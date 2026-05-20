import os
import pymupdf4llm

def batch_convert():
    input_dir = "input_pdfs"
    output_dir = "output_mds"
    
    # Create the output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)

    # Loop through all files in the input directory
    for filename in os.listdir(input_dir):
        if filename.lower().endswith(".pdf"):
            pdf_path = os.path.join(input_dir, filename)
            md_filename = filename[:-4] + ".md"
            md_path = os.path.join(output_dir, md_filename)
            
            print(f"Converting {filename}...")
            try:
                # Extract markdown text
                md_text = pymupdf4llm.to_markdown(pdf_path)
                
                # Write to .md file
                with open(md_path, "w", encoding="utf-8") as f:
                    f.write(md_text)
                print(f"Successfully saved to {md_filename}")
                
            except Exception as e:
                print(f"Failed to convert {filename}. Error: {e}")

if __name__ == "__main__":
    batch_convert()