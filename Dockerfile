# Use an official Python runtime as a parent image
FROM python:3.8-slim

# Set environment variables
ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

# Set the working directory in the container
WORKDIR /code

# Copy the current directory contents into the container at /code
COPY . /code/

# Install any needed packages specified in requirements.txt
RUN pip install -r requirements.txt

# Expose the port that the app runs on
EXPOSE 8000

# Define the command to run your server
# CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
CMD ["python", "manage.py", "runsslserver", "0.0.0.0:8000","--certificate","fullchain.pem","--key","privkey.pem"]

