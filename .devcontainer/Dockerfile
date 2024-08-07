# Image to build
FROM node:lts-alpine

# Arguments will be passed from Compose
ARG CURRENT_USER
ARG USER_UID
ARG USER_GID

# Initialize
RUN apt update -y
RUN apt install sudo -y
RUN addgroup --gid $USER_GID $CURRENT_USER
RUN adduser --uid $USER_UID --gid $USER_GID --disabled-password $CURRENT_USER
RUN echo '$CURRENT_USER ALL=(ALL) NOPASSWD: ALL' >> /etc/sudoers

# Set user inside container
USER $CURRENT_USER

# Set up working directory
# Set permission and copy data to inside container
WORKDIR /home/$CURRENT_USER/server
COPY --chown=$CURRENT_USER:$CURRENT_USER . /home/$CURRENT_USER/server

# Default command will run
CMD ["npm", "run", "dev"]