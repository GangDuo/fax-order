FROM centos:7

RUN set -x && \
    rpm --import /etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-7 && \
    yum -y install which \
                   gtk2 atk pango gdk-pixbuf2 libXrandr GConf2 libXcursor libXcomposite libnotify libXtst cups-libs glib2-devel libXScrnSaver alsa-lib \
                   xorg-x11-server-Xvfb ipa-mincho-fonts ipa-gothic-fonts ipa-pmincho-fonts ipa-pgothic-fonts xorg-x11-fonts* vlgothic-* && \
    curl -sL https://rpm.nodesource.com/setup_10.x | bash - && \
    dbus-uuidgen > /var/lib/dbus/machine-id && \
    yum -y install nodejs
#    systemctl start dbus.service && \

WORKDIR /app
ADD fax-order.tar.gz .
RUN set -x && \
    npm install 

CMD ["xvfb-run", "-a", "node", "index.js"]

